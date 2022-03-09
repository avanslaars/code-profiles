$(window).on('load', function () {
  gifffer();

  const growers = document.querySelectorAll(".grow-wrap");

  $('.feature').each(function () {
    $(this).find('h4').append("<div class='codicon codicon-warning feature-warning' title='This feature is not available because your license has expired.'></div>");
    $(this).find('h4').after("<div class='feature-not-available-links'><a href='' class='renew-url btn btn-link p-0 m-0'>Renew License</a><span class='px-2'> | </span><button type='button' class='request-trial-action btn btn-link p-0 m-0'>Try the feature</button></div>");
  });

  $('.tutorial-warning').attr('title', 'There are some new/modified tutorial modules')

  function featureAvailable(coreMajor, coreMinor, coreRevision, featureMajor, featureMinor, featureRevision) {
    if (featureMajor < coreMajor) return true;
    if (featureMajor > coreMajor) return false;

    // featureMajor === coreMajor
    if (featureMinor < coreMinor) return true;
    if (featureMinor > coreMinor) return false;

    // major.minor are the same...
    return (featureRevision <= coreRevision);
  }

  growers.forEach((grower) => {
    const textarea = grower.querySelector("textarea");
    textarea.addEventListener("input", () => {
      grower.dataset.replicatedValue = textarea.value;
    });
  });

  const vscode = acquireVsCodeApi();

  const menuItems = $('.nav-items li');
  let scrolling = false;

  const oldState = vscode.getState();
  let initialScrollTop = (oldState && oldState.scrollTop) || 0;
  const scrollTo = function(offset, callback, behavior) {
    const fixedOffset = offset.toFixed(),
      onScroll = function () {
        const limit = (window.document.body.offsetHeight - window.innerHeight).toFixed();
        if (window.pageYOffset.toFixed() === limit || window.pageYOffset.toFixed() === fixedOffset) {
          window.removeEventListener('scroll', onScroll);
          callback();
        }
      };

    window.addEventListener('scroll', onScroll);
    onScroll();
    vscode.setState({ scrollTop: offset });

    window.scrollTo({
      top: offset,
      behavior: behavior || 'smooth',
    });
  }

  const setActiveMenuItem = function (activeIndex) {
    menuItems.each(function (index, element) {
      if (index == activeIndex) {
        $(element).addClass('active');
      } else {
        $(element).removeClass('active');
      }
    });
  };

  menuItems.on('click', function () {
    const sectionId = $(this).data('section');
    const section = $('#' + sectionId).get(0);

    let top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;

    let activeIndex = 0;
    menuItems.each(function (index, element) {
      if (sectionId === $(element).data('section')) {
        activeIndex = index;
      }
    });

    if (activeIndex === 0) {
      top = 0;
    }

    scrolling = true;
    scrollTo(top, function() {
      scrolling = false;
    });

    setActiveMenuItem(activeIndex);
  });

  $(window).scroll(function () {
    if (scrolling) return;
    const scrollTop = $(window).scrollTop();
    vscode.setState({ scrollTop });
    let activeIndex = 0;
    menuItems.each(function (index, element) {
      const sectionId = $(element).data('section');
      const section = $('#' + sectionId).get(0);
      const viewportOffset = section.getBoundingClientRect();
      if (viewportOffset.top < 50 && viewportOffset.height) {
        activeIndex = index;
      }
    });
    setActiveMenuItem(activeIndex);
  });

  // Hide screen to begin with
  $('#main').hide();
  $('.sale-section').hide();
  $('.tutorial-warning').hide();
  $('.complete-tutorial').hide();

  function resetLicenseSections() {
    $('.feature-not-available').hide();
    $('.feature > h4 > div.feature-warning').hide();
    $('.feature > div.feature-not-available-links').hide();

    $('.activating').hide();
    $('.license-warning').hide();
    $('.license-error').hide();
    $("#activation-key").prop("disabled", false);
    $('#activation-key').val('');
    $('#activation-key').get(0).parentNode.dataset.replicatedValue = '';
    $('#activate-validation-error').text('');
    $('#activate-server-error').text('');
    $('#activate-success').text('');
    $('#activate-validation-error').hide();
    $('#activate-server-error').hide();
    $('#activate-success').hide();
    $('#activation-spinner').hide();
    $('#activation-submit').show();
    $('#activation-cancel').show();

    $("#request-trial-email").val('');
    $('#trial-error').hide();
    $('#trial-validation-error').hide();
    $('#trial-success').hide();
    $('#trial-cancel').text('Cancel');
    $("#request-trial-email").prop("disabled", false);
    $('#trial-spinner').hide();
    $('#trial-submit').show();
    $('#trial-cancel').show();
    $('.activated').hide();
    $('.open-source').hide();
    $('.expiring').hide();
    $('.expired').hide();
    $('.demo-license').hide();
    $('.trial-license').hide();
    $('.trial-demo-over').hide();
    $('.request-trial').hide();
    $('.activate').hide();
    $('.activate-license-details').hide();
  }

  function configureCheckboxSetting(setting, value) {
    const id = setting.replace(/\./g, '');
    const setCheckbox = value => {
      if (value) {
        $('#' + id + ' div.custom-checkbox').addClass('codicon-check');
      } else {
        $('#' + id + ' div.custom-checkbox').removeClass('codicon-check');
      }
    }

    $('#' + id).click(function (e) {
      value = !value;
      setCheckbox(value);
      vscode.postMessage({ command: 'updateSetting', setting, value });
    });

    setCheckbox(value);
  };

  function loadLicenseDetails(licenseDetails) {
    resetLicenseSections();

    $('.product-type').text(licenseDetails.productType);
    $('.registered-to').text(licenseDetails.registeredTo);
    $('.expiry-date').text(licenseDetails.expiryDate);
    $('.days-until-expiry').text(licenseDetails.daysUntilExpiry);

    $('.purchase-url').attr('href', licenseDetails.purchaseUrl);
    $('.upgrade-url').attr('href', licenseDetails.upgradeUrl);
    $('.renew-url').attr('href', licenseDetails.renewUrl);

    if (licenseDetails.isBundle) {
      $('.not-bundle-product').hide();
    } else {
      $('.not-bundle-product').show();
    }

    switch (licenseDetails.state) {
      case 'activating':
        $('.activating').show();
        break;

      case 'activated':
        $('.activated').show();
        break;

      case 'openSource':
        $('.open-source').show();
        break;

      case 'expiring':
        $('.expiring').show();
        $('.license-warning').show();
        break;

      case 'expired':
        $('.expired').show();
        $('.license-warning').show();
        $('.feature').each(function () {
          let coreMajor, coreMinor, coreRevision;
          try {
            [coreMajor, coreMinor, coreRevision] = coreVersion.split('.').map(item => parseInt(item, 10));
          } catch {
            coreMajor = coreMinor = coreRevision = 0;
          }

          const [featureMajor, featureMinor, featureRevision] = $(this).attr('data-core-version').split('.').map(item => parseInt(item, 10));
          if (!featureAvailable(coreMajor, coreMinor, coreRevision, featureMajor, featureMinor, featureRevision)) {
            $('.feature-not-available').show();
            $(this).find('h4 > div.feature-warning').show();
            $(this).find('div.feature-not-available-links').show();
          }
        });
        break;

      case 'demoLicense':
        $('.demo-license').show();
        $('.license-warning').show();
        break;

      case 'trialLicense':
        $('.trial-license').show();
        break;

      case 'trialDemoOver':
        $('.trial-demo-over').show();
        $('.license-error').show();
        break;
    }
  }

  function setTutorialDetails(state) {
    if (!state) return;
    if (!state.completedModules) state.completedModules = {};
    if (!state.moduleCount) state.moduleCount = NaN;

    const currentVersion = $('#tutorial').data('tutorial-version');

    let uncompletedModuleCount = 0;
    const completedModules = Object.keys(state.completedModules);
    for (let completedModule of completedModules) {
      const completedModuleVersion = state.completedModules[completedModule];
      if (currentVersion > completedModuleVersion) {
        uncompletedModuleCount++;
      }
    }

    let progressLabel = `All tutorial modules have been completed.`;
    let upToDate = true;

    if (state.moduleCount === completedModules.length) {
      if (uncompletedModuleCount) {
        upToDate = false;
        progressLabel = `Completed ${state.moduleCount - uncompletedModuleCount} of ${state.moduleCount} tutorial modules.`;
      }
    } else {
      upToDate = false;
      if (state.moduleCount) {
        progressLabel = `Completed ${completedModules.length} of ${state.moduleCount} tutorial modules.`;
      } else {
        progressLabel = `Completed ${completedModules.length} tutorial modules.`;
      }
    }

    $('.tutorial-progress').text(progressLabel);

    if (!upToDate) {
      $('.tutorial-warning').show();
      $('.complete-tutorial').show();
      $('.tutorial-progress').addClass('incomplete');
    } else {
      $('.tutorial-warning').hide();
      $('.complete-tutorial').hide();
      $('.tutorial-progress').removeClass('incomplete');
    }
  }

  let licenseDetails;
  let coreVersion;
  let whatsNewVersion;

  window.addEventListener('message', message => {
    const event = message.data;
    switch (event.command) {
      case 'initialState':
        licenseDetails = event.licenseDetails;
        coreVersion = event.coreVersion;
        whatsNewVersion = event.whatsNewVersion;

        $('#main').show();

        const looksLikeEmail = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/;

        configureCheckboxSetting('startAutomatically', event.settings.startAutomatically)
        configureCheckboxSetting('codeLensFeature.runTest', event.settings.codeLensRunTest);
        configureCheckboxSetting('codeLensFeature.debugger', event.settings.codeLensDebugger);
        configureCheckboxSetting('codeLensFeature.testStory', event.settings.codeLensTestStory);
        configureCheckboxSetting('codeLensFeature.profiler', event.settings.codeLensProfiler);
        configureCheckboxSetting('codeLensFeature.testFilters', event.settings.codeLensTestFilters);
        configureCheckboxSetting('codeLensFeature.updateSnapshots', event.settings.codeLensUpdateSnapshots);
        configureCheckboxSetting('reportFailuresAsProblems', event.settings.reportFailuresAsProblems)
        configureCheckboxSetting('startViewStatusBar', event.settings.startViewStatusBar)
        configureCheckboxSetting('compactMessageOutput', event.settings.compactMessageOutput)
        configureCheckboxSetting('showStartViewOnFeatureRelease', event.settings.showStartViewOnFeatureRelease)
        configureCheckboxSetting('suppressExpirationNotifications', event.settings.suppressExpirationNotifications);

        setTutorialDetails(event.tutorial);

        if (!event.settings.codeLens) {
          // Don't show code lens settings if user has legacy 'codeLens' setting.
          $('.codelens').hide();
        }

        $('.otherSettings').click(function (e) {
          e.preventDefault();
          vscode.postMessage({ command: 'otherSettings' });
        });

        $('.dismiss-sale').click(function() {
          vscode.postMessage({ command: 'dismissSale' });
          $('.sale-section').hide();
        });

        $('.open-tutorial').click(function(e) {
          e.preventDefault();
          vscode.postMessage({ command: 'openTutorial' });
        });

        function activateLicense() {
          resetLicenseSections();

          if (licenseDetails && licenseDetails.email && licenseDetails.onlineLicense) {
            $('#activation-key').val(licenseDetails.email);
            $('#activation-key').get(0).parentNode.dataset.replicatedValue = licenseDetails.email;
          } else if (licenseDetails && licenseDetails.key) {
            $('#activation-key').val(licenseDetails.key);
            $('#activation-key').get(0).parentNode.dataset.replicatedValue = licenseDetails.key;
          }
          $('.activate').show();

          setTimeout(function () {
            if (licenseDetails && ((licenseDetails.email && licenseDetails.onlineLicense) || (licenseDetails && licenseDetails.key))) {
              $('#activation-key').focus();
              $('#activation-key').select();
            } else {
              $('#activation-key').focus();
            }
          }, 100)
        }

        $('.activate-license').click(function() {
          activateLicense();
        });

        $('#activation-cancel').click(function() {
          loadLicenseDetails(licenseDetails);
        });

        function requestTrial() {
          resetLicenseSections();
          $('.request-trial').show();

          setTimeout(() => {
            $('#request-trial-email').focus();
          }, 100);
        }

        $('.request-trial-action').click(function() {
          requestTrial();
        });

        $('#trial-cancel').click(function() {
          loadLicenseDetails(licenseDetails);
        });

        $("#request-trial-email").on("change paste keyup", function() {
          $('#trial-validation-error').hide();

          if ($('#request-trial-email').data('submit')) {
            $('#request-trial-email').data('submit', false);
            $('#trial-submit').trigger('click');
          }
        });

        $('#request-trial-email').on("keypress", function(e) {
          if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            if (!$(this).val()) {
              e.preventDefault();
              return false;
            }
            $('#request-trial-email').data('submit', true);
          }
        });

        function validateActivationForm() {
          $('#activate-validation-error').hide();
          $('#activate-server-error').hide();

          return true;
        }

        $('#activation-key').on("change paste keyup", function() {
          if (!validateActivationForm()) return;
        });

        $('#activation-submit').click(function () {
          if (!validateActivationForm()) return;

          const keyField = $('#activation-key');

          let email = keyField.val();
          let key = keyField.val();

          if (looksLikeEmail.test(email)) {
            key = undefined;
          } else {
            email = undefined;
          }

          if (email && !looksLikeEmail.test(email)) {
            $('#activate-validation-error').text('Invalid email address or license key.');
            $('#activate-validation-error').show();
            return;
          }

          if (key && key.length < 50) {
            $('#activate-validation-error').text('Invalid email address or license key.');
            $('#activate-validation-error').show();
            return;
          }

          if (!key && !email) {
            $('#activate-validation-error').text('Please provide your email address OR your license key.');
            $('#activate-validation-error').show();
            return;
          }

          $('#activation-spinner').show();
          $('#activation-submit').hide();
          $('#activation-cancel').hide();

          $("#activation-key").prop("disabled", true);

          if (email) {
            vscode.postMessage({ command: 'activateLicense', email });
          } else {
            vscode.postMessage({ command: 'activateLicense', key });
          }
        });

        $('#trial-submit').click(function() {
          const email = $("#request-trial-email").val();

          if (!looksLikeEmail.test(email)) {
            $('#trial-validation-error').show();
            return;
          }

          $('#trial-validation-error').hide();

          $('#trial-spinner').show();
          $('#trial-submit').hide();
          $('#trial-cancel').hide();
          $("#request-trial-email").prop("disabled", true);

          vscode.postMessage({ command: 'trialRequest', email });
        });

        if (event.allCommandsShortcut) {
          $('.all-command-shortcut').text(event.allCommandsShortcut);
        } else {
          $('.display-commands-hint').hide();
        }

        loadLicenseDetails(licenseDetails);

        scrollTo(initialScrollTop, () => {}, 'auto');
        break;

      case 'scrollToTop':
        scrollTo(0, () => {}, 'auto');
        break;

      case 'sale':
        $('.sale-section').show();
        $('.sale-discount').text(event.discount);
        break;

      case 'activateLicense': {
        const section = $('#license').get(0);
        const top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;
        scrollTo(top, () => {}, 'auto');
        activateLicense();
        if (licenseDetails.state === 'activated' || licenseDetails.state === 'expired' || licenseDetails.state === 'expiring') {
          $('.activate-license-details').show();
        }
        setTimeout(() => {
          const section = $('#license').get(0);
          const top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;
          scrollTo(top, () => {}, 'auto');
        }, 150);
        break;
      }

      case 'requestTrial': {
        const section = $('#license').get(0);
        const top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;
        scrollTo(top, () => {}, 'auto');
        requestTrial();
        setTimeout(() => {
          const section = $('#license').get(0);
          const top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;
          scrollTo(top, () => {}, 'auto');
        }, 150);
        break;
      }

      case 'showWhatsNew': {
        let coreMajor, coreMinor, coreRevision;
        try {
          [coreMajor, coreMinor, coreRevision] = coreVersion.split('.').map(item => parseInt(item, 10));
        } catch {
          coreMajor = coreMinor = coreRevision = 0;
        }

        var atLeastOneFeatureVisible = false;
        var maxWhatsNewFeatureVersion = 0;
        $('.feature').each(function () {
          const whatsNewFeatureVersion = parseInt($(this).attr('data-whats-new-version'), 10);
          maxWhatsNewFeatureVersion = Math.max(maxWhatsNewFeatureVersion, whatsNewFeatureVersion);
          atLeastOneFeatureVisible = atLeastOneFeatureVisible || (whatsNewFeatureVersion > (whatsNewVersion || 0));
        });

        $('.feature').each(function () {
          const featureVisible = parseInt($(this).attr('data-whats-new-version'), 10) > (whatsNewVersion || 0);
          if (atLeastOneFeatureVisible && !featureVisible) {
            $(this).remove();
          } else {
            if (licenseDetails.state === 'expired') {
              const [featureMajor, featureMinor, featureRevision] = $(this).attr('data-core-version').split('.').map(item => parseInt(item, 10));
              if (!featureAvailable(coreMajor, coreMinor, coreRevision, featureMajor, featureMinor, featureRevision)) {
                $('.feature-not-available').show();
                $(this).find('h4 > div.feature-warning').show();
                $(this).find('div.feature-not-available-links').show();
              }
            }
          }
        });

        const section = $('#whatsnew').get(0);
        const top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;
        scrollTo(top, () => {}, 'auto');

        vscode.postMessage({ command: 'updateWhatsNewVersion', version: maxWhatsNewFeatureVersion });
        break;
      }

      case 'trialRequestSuccess':
        $('#trial-spinner').hide();
        $('#trial-cancel').show();
        $('#trial-cancel').text('Close');
        $('#trial-success').show();
        break;

      case 'trialRequestError':
        $("#request-trial-email").prop("disabled", false);
        $('#trial-spinner').hide();
        $('#trial-cancel').show();
        $('#trial-cancel').text('Close');
        $('#trial-error').show();
        break;

      case 'activationError':
        $("#activation-key").prop("disabled", false);
        $('#activation-spinner').hide();
        $('#activation-submit').show();
        $('#activation-cancel').show();
        $('#activate-server-error').text(event.message);
        $('#activate-server-error').show();
        break;

      case 'activationSuccess':
        licenseDetails = event.licenseDetails;
        $('#activation-spinner').hide();
        $('#activation-cancel').show();
        $('#activation-cancel').text('Close');
        $('#activate-success').text(event.message);
        $('#activate-success').show();
        break;

      case 'updateTutorialProgress':
        setTutorialDetails(event.tutorial);
        break;
    }
  });

  // Tell the host that we've loaded and need to get initial state
  vscode.postMessage({ command: 'requestInitialState' });
});
