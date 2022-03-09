/* eslint-disable no-undef */
$(function () {
  gifffer();

  const growers = document.querySelectorAll(".grow-wrap");

  $('.feature').each(function () {
    $(this).find('h4').append("<div class='codicon codicon-warning feature-warning' title='This feature is not available because your license has expired.'></div>");
    $(this).find('h4').after("<div class='feature-not-available-links'><a href='' class='renew-url btn btn-link p-0 m-0'>Renew License</a><span class='px-2'> | </span><button type='button' class='request-trial-action btn btn-link p-0 m-0'>Try the feature</button></div>");

    if ($(this).find('.pro-edition').length) {
      $(this).find('h4').append("<div class='codicon codicon-warning community' title=\"This feature is only available to Quokka 'PRO' users.\"></div>");
      $(this).find('h4').after("<div class='community-links'><a href='' class='purchase-url btn btn-link p-0 m-0'>Purchase Quokka 'PRO'</a><span class='px-2'> | </span><button type='button' class='request-trial-action btn btn-link p-0 m-0'>Try the feature</button></div>");
    }
  });

  $('.lazy').Lazy({
    afterLoad: function(element) {
      var imgId = 'id' + Date.now();
      element.attr('id', imgId);
      if (element.hasClass('animated')) {
        element.attr('data-gifffer', element.attr('src'));
        gifffer('#' + imgId, undefined, undefined, function() {
          element.parent().attr('style', '');
        });
      }
      element.addClass('loaded');
    }
  });

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
    const fixedOffset = offset.toFixed();
    const onScroll = function () {
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
  };

  const setActiveMenuItem = function (activeIndex) {
    menuItems.each(function (index, element) {
      if (index === activeIndex) {
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
  $('.country-discount-section').hide();
  $('.community-edition').hide();
  $('.sale-section').hide();


  const now = Date.now();

  $('.feature').each(function () {
    const [yearFrom, monthFrom, dayFrom] = ($(this).attr('data-display-from') || '2000-01-01').split('-').map(item => item && parseInt(item, 10));
    const [yearTo, monthTo, dayTo] = ($(this).attr('data-display-to') || '9999-01-01').split('-').map(item => item && parseInt(item, 10));

    if (yearFrom) {
      const from = Date.UTC(yearFrom, monthFrom - 1, dayFrom);
      if (now < from) {
        $(this).remove();
      }
    }

    if (yearTo) {
      const to = Date.UTC(yearTo, monthTo - 1, dayTo);

      if (now > to) {
        $(this).remove();
      }
    }
  });

  function resetLicenseSections() {
    $('.feature-not-available').hide();
    $('.feature > h4 > div.feature-warning').hide();
    $('.feature > div.feature-not-available-links').hide();
    $('.feature > div.community-links').hide();

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

    $(".request-trial-email").val('');
    $('.trial-error').hide();
    $('.trial-validation-error').hide();
    $('.trial-success').hide();
    $('.trial-cancel').text('Cancel');
    $(".request-trial-email").prop("disabled", false);
    $('.trial-spinner').hide();
    $('.trial-submit').show();
    $('.trial-cancel').show();
    $('.activated').hide();
    $('.community').hide();
    $('.community-links').hide();
    $('.expiring').hide();
    $('.expired').hide();
    $('.expiredWrongVersion').hide();
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
    };

    $('#' + id).click(function () {
      value = !value;
      setCheckbox(value);
      vscode.postMessage({ command: 'updateSetting', setting, value });
    });

    setCheckbox(value);
  };

  function configureInputBoxSetting(setting, value) {
    const id = setting.replace(/\./g, '');
    let originalValue = value;

    const elem = $('#' + id);

    elem.val(value);

    elem.on('paste', function(e) {
      $(e.target).keyup();
    });

    elem.on('keyup', function() {
      const value = elem.val();
      if (value !== originalValue) {
        originalValue = value;
        vscode.postMessage({ command: 'updateSetting', setting, value });
      }
    });
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
    $('.previous-version-url').attr('href', licenseDetails.previousVersionUrl);

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

      case 'community':
        $('.community-edition').show();
        $('.community').show();
        $('.community-links').show();
        $('.feature-not-available').show();
        break;

      case 'expiring':
        $('.expiring').show();
        $('.license-warning').show();
        break;

      case 'expired':
        $('.expired').show();
        $('.license-warning').show();
        $('.feature').each(function () {
          const [year, month, day] = $(this).attr('data-build-date').split('-').map(item => parseInt(item, 10));
          const featureBuildDate = new Date(year, month - 1, day);
          featureBuildDate.setHours(0, 0, 0);
          if (buildDate.getTime() < featureBuildDate.getTime()) {
            $('.feature-not-available').show();
            $(this).find('h4 > div.feature-warning').show();
            $(this).find('div.feature-not-available-links').show();
          }
        });
        break;

      case 'expiredWrongVersion':
        $('.expiredWrongVersion').show();
        $('.license-error').show();
        $('.feature').each(function () {
          const [year, month, day] = $(this).attr('data-build-date').split('-').map(item => parseInt(item, 10));
          const featureBuildDate = new Date(year, month - 1, day);
          featureBuildDate.setHours(0, 0, 0);
          if (buildDate.getTime() < featureBuildDate.getTime()) {
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

  let licenseDetails;
  let buildDate;
  let initialized = false;
  let toProcess = [];

  const scrollToSection = (id, action) => {
    const implementation = (id) => {
      const section = $('#' + id).get(0);
      const top = section.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 10;
      scrollTo(top, () => {}, 'auto');
    };

    implementation(id);
    if (action) { action(); }
  };

  const wireGlobalConfigSettings = (globalConfig) => {
    const wireGlobalConfigCheckbox = (setting) => {
      const id = setting.replace(/\./g, '');
      const invert = $('#' + id).hasClass('invert');

      const setCheckbox = value => {
        if (invert) value = !value;
        if (value) {
          $('#' + id + ' div.custom-checkbox').addClass('codicon-check');
        } else {
          $('#' + id + ' div.custom-checkbox').removeClass('codicon-check');
        }
      };

      $('#' + id).off();
      $('#' + id).on('click', function () {
        globalConfig[setting] = !globalConfig[setting];
        setCheckbox(globalConfig[setting]);
        vscode.postMessage({ command: 'saveGlobalConfig', globalConfig });
      });

      setCheckbox(globalConfig[setting]);
    }

    const wireNumericInputBox = (setting, min, max) => {
      const id = setting.replace(/\./g, '');
      let originalValue = globalConfig[setting];

      const elem = $('#' + id);

      elem.val(originalValue);

      elem.on('paste', function(e) {
        $(e.target).keyup();
      });

      elem.on('keyup', function() {
        const value = elem.val();
        if (value !== originalValue) {
          try {
            const numericValue = parseInt(value, 10) || 0;
            globalConfig[setting] = numericValue;
            if (numericValue < min) globalConfig[setting] = min;
            if (numericValue > max) globalConfig[setting] = max;
          } catch (e) {
            globalConfig[setting] = min;
          }
          elem.val(globalConfig[setting]);
          vscode.postMessage({ command: 'saveGlobalConfig', globalConfig });
        }
      });
    };

    wireGlobalConfigCheckbox('autoLog');
    wireGlobalConfigCheckbox('showValueOnSelection');
    wireGlobalConfigCheckbox('showSingleInlineValue');
    wireGlobalConfigCheckbox('recycle');
    wireNumericInputBox('delay', 0, 60000);
    wireNumericInputBox('logLimit', 10, 1000000);
  }

  window.addEventListener('message', message => {
    const event = message.data;

    function processEvent(event) {
      switch (event.command) {
        case 'initialState':
          licenseDetails = event.licenseDetails;
          buildDate = new Date(event.buildDate);

          $('.feature').each(function () {
            const versionCountry = $(this).attr('data-whats-new-version');
            const [, country] = versionCountry.split('-');
            if (country) {
              if (country.startsWith('!')) {
                const countries = country.substring(1).split(',');
                countries.forEach(country => {
                  if (country === event.country) {
                    $(this).remove();
                  }
                });
              } else {
                if (country !== event.country) {
                  $(this).remove();
                }
              }
            }
          });

          $('#main').show();

          const looksLikeEmail = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/;

          configureCheckboxSetting('compactMessageOutput', event.settings.compactMessageOutput);
          configureCheckboxSetting('showOutputOnStart', event.settings.showOutputOnStart);
          configureCheckboxSetting('startViewStatusBar', event.settings.startViewStatusBar);
          configureCheckboxSetting('suppressExpirationNotifications', event.settings.suppressExpirationNotifications);
          configureCheckboxSetting('showStartViewOnFeatureRelease', event.settings.showStartViewOnFeatureRelease);
          configureCheckboxSetting('automaticRestart', event.settings.automaticRestart);
          configureInputBoxSetting('automaticStartRegex', event.settings.automaticStartRegex);

          wireGlobalConfigSettings(event.globalConfig);

          $('#otherSettings').click(function () {
            vscode.postMessage({ command: 'otherSettings' });
          });

          $('#configJson').click(function () {
            vscode.postMessage({ command: 'configJson' });
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

            if (licenseDetails && licenseDetails.email && licenseDetails.onlineLicense) {
              $('#activation-key').focus();
              $('#activation-key').select();
            } else if (licenseDetails && licenseDetails.key) {
              $('#activation-key').focus();
              $('#activation-key').select();
            } else {
              $('#activation-key').focus();
            }
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
            scrollToSection('license', () => $('.request-trial-email').focus());
          }

          $('.request-trial-action').click(function() {
            requestTrial();
          });

          $('.use-community-edition').click(function() {
            vscode.postMessage({ command: 'useCommunityEdition' });
          });

          $('.launch-demo').click(function() {
            vscode.postMessage({ command: 'launchDemo' });
          });

          $('.request-trial-action-offscreen').click(function() {
            vscode.postMessage({ command: 'switchToPro' });
          });

          $('.trial-cancel').click(function() {
            loadLicenseDetails(licenseDetails);
          });

          $(".request-trial-email").on("change paste keyup", function() {
            $('.trial-validation-error').hide();

            if ($(this).data('submit')) {
              $(this).data('submit', false);
              $(this).siblings('.trial-submit').trigger('click');
            }
          });

          $('.request-trial-email').on("keypress", function(e) {
            if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
              if (!$(this).val()) {
                e.preventDefault();
                return false;
              }
              $('.request-trial-email').data('submit', true);
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

          $('.trial-submit').click(function() {
            const email = $(this).siblings('.request-trial-email').val();

            if (!looksLikeEmail.test(email)) {
              $('.trial-validation-error').show();
              return;
            }

            $('.trial-validation-error').hide();

            $('.trial-spinner').show();
            $('.trial-submit').hide();
            $('.trial-cancel').hide();
            $(".request-trial-email").prop("disabled", true);

            vscode.postMessage({ command: 'trialRequest', email });
          });

          if (event.allCommandsShortcut) {
            $('.all-command-shortcut').text(event.allCommandsShortcut);
          } else {
            $('.display-commands-hint').hide();
          }

          loadLicenseDetails(licenseDetails);

          scrollTo(initialScrollTop, () => {}, 'auto');

          toProcess.forEach(event => processEvent(event));
          toProcess = [];
          break;

        case 'activateLicense': {
          activateLicense();
          if (licenseDetails.state === 'activated' || licenseDetails.state === 'expired' || licenseDetails.state === 'expiring') {
            $('.activate-license-details').show();
          }
          scrollToSection('license');
          break;
        }

        case 'requestTrial': {
          requestTrial();
          scrollToSection('license');
          break;
        }

        case 'firstInstall':
          vscode.postMessage({ command: 'useCommunityEdition' });
          break;

        case 'goToLicenseSection': {
          scrollToSection('license');
          break;
        }

        case 'countryDiscount': {
          $('.discount-country').text(event.offer.country);
          $('.discount-amount').text(event.offer.discount);
          if (event.offer.sale && event.offer.saleDiscount) {
            $('.sale-section').show();
            $('.sale-discount').text(event.offer.saleDiscount)
          } else if (event.offer.display) {
            $('.country-discount-section').show();
          }
          $('#country-discount-spinner').hide();
          break;
        }

        case 'showWhatsNew': {
          const whatsNewVersion = event.previousWhatsNewVersion;

          var atLeastOneFeatureVisible = false;
          var maxWhatsNewFeatureVersion = 0;
          $('.feature').each(function () {
            const versionCountry = $(this).attr('data-whats-new-version');
            const [version] = versionCountry.split('-');
            const whatsNewFeatureVersion = parseInt(version, 10);
            maxWhatsNewFeatureVersion = Math.max(maxWhatsNewFeatureVersion, whatsNewFeatureVersion);
            atLeastOneFeatureVisible = atLeastOneFeatureVisible || (whatsNewFeatureVersion > (whatsNewVersion || 0));
          });

          $('.feature').each(function () {
            const versionCountry = $(this).attr('data-whats-new-version');
            const [version] = versionCountry.split('-');
            const whatsNewFeatureVersion = parseInt(version, 10);

            const featureVisible = whatsNewFeatureVersion > (whatsNewVersion || 0);
            if (atLeastOneFeatureVisible && !featureVisible) {
              $(this).remove();
            } else {
              if (licenseDetails && licenseDetails.state === 'expired') {
                const [year, month, day] = $(this).attr('data-build-date').split('-').map(item => parseInt(item, 10));
                const featureBuildDate = new Date(year, month - 1, day);
                featureBuildDate.setHours(0, 0, 0);

                if (buildDate.getTime() < featureBuildDate.getTime()) {
                  $('.feature-not-available').show();
                  $(this).find('h4 > div.feature-warning').show();
                  $(this).find('div.feature-not-available-links').show();
                }
              }
            }
          });

          scrollToSection('whatsnew');

          vscode.postMessage({ command: 'updateWhatsNewVersion', version: maxWhatsNewFeatureVersion });
          break;
        }

        case 'switchToPro':
          $('.country-discount-section').hide();
          $('.community-edition').hide();
          licenseDetails = event.licenseDetails;
          loadLicenseDetails(licenseDetails);
          scrollToSection('license', () => $('.request-trial-demo input').focus());
          break;

        case 'switchToCommunityEdition':
          $('.community-edition').show();
          licenseDetails = event.licenseDetails;
          loadLicenseDetails(licenseDetails);
          scrollTo(0, () => {}, 'auto');
          break;

        case 'trialRequestSuccess':
          $('.trial-spinner').hide();
          $('.trial-cancel').show();
          $('.trial-cancel').text('Close');
          $('.trial-success').show();
          break;

        case 'trialRequestError':
          $(".request-trial-email").prop("disabled", false);
          $('.trial-spinner').hide();
          $('.trial-cancel').show();
          $('.trial-cancel').text('Close');
          $('.trial-error').show();
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
      }
    }

    if (initialized) {
      processEvent(event);
    } else if (event.command === 'initialState') {
      processEvent(event);
      initialized = true;
    } else {
      toProcess.push(event);
    }
  });

  // Tell the host that we've loaded and need to get initial state
  vscode.postMessage({ command: 'requestInitialState' });
});
