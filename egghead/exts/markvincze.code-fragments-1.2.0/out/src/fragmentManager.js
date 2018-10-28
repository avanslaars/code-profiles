"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeFragmentHeader {
    constructor(id, label) {
        this.id = id;
        this.label = label;
    }
}
exports.CodeFragmentHeader = CodeFragmentHeader;
class CodeFragmentCollection {
    constructor(fragments) {
        this.fragments = fragments;
    }
}
exports.CodeFragmentCollection = CodeFragmentCollection;
class CodeFragmentContent {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }
}
exports.CodeFragmentContent = CodeFragmentContent;
class FragmentManager {
    constructor(extensionContext) {
        this.extensionContext = extensionContext;
        this.codeFragments = undefined;
        this.fragmentsChangeEvent = [];
    }
    initialize() {
        this.codeFragments = this.extensionContext.globalState.get('CodeFragmentCollection');
        if (this.codeFragments) {
            return Promise.resolve();
        }
        const exampleFragmentContent = `// This is an example fragment.
// Save a new fragment with the "Save selection as Code Fragment" command.
function foo() {
  alert('Thank you for using the Code Fragments extension!');
}`;
        const exampleFragmentId = this.saveCodeFragmentContent(exampleFragmentContent);
        this.codeFragments = new CodeFragmentCollection([
            new CodeFragmentHeader(exampleFragmentId, 'Example fragment')
        ]);
        return this.extensionContext.globalState.update('CodeFragmentCollection', this.codeFragments);
    }
    getFragmentContent(id) {
        return this.extensionContext.globalState.get(id);
    }
    saveNewCodeFragment(content, label) {
        const id = this.saveCodeFragmentContent(content);
        const header = new CodeFragmentHeader(id, label);
        this.codeFragments.fragments.push(header);
        this.fireFragmentsChanged();
        return this.persistCodeFragmentCollection()
            .then(() => id);
    }
    deleteFragment(fragmentId) {
        return this.extensionContext.globalState.update(fragmentId, undefined)
            .then(() => {
            const fragmentToDelete = this.codeFragments.fragments.findIndex(f => f.id === fragmentId);
            if (fragmentToDelete !== -1) {
                this.codeFragments.fragments.splice(fragmentToDelete, 1);
                this.fireFragmentsChanged();
                return this.persistCodeFragmentCollection();
            }
            return Promise.resolve();
        });
    }
    renameFragment(fragmentId, newLabel) {
        const fragment = this.codeFragments.fragments.find(f => f.id === fragmentId);
        if (fragment) {
            fragment.label = newLabel;
            this.fireFragmentsChanged();
            return this.persistCodeFragmentCollection();
        }
        return Promise.resolve();
    }
    deleteAllFragments() {
        const tasks = this.codeFragments.fragments.map(f => this.extensionContext.globalState.update(f.id, undefined));
        this.codeFragments = new CodeFragmentCollection([]);
        this.persistCodeFragmentCollection();
        this.fireFragmentsChanged();
        // NOT: The extra Promise is here just to change the type generic type of the Promise from void[] to void.
        return new Promise((resolve, reject) => {
            Promise.all(tasks).then(() => resolve(), (reason) => reject(reason));
        });
    }
    moveUpCodeFragment(id) {
        return this.executeMove(id, index => {
            if (index > 0) {
                this.codeFragments.fragments.splice(index - 1, 0, this.codeFragments.fragments.splice(index, 1)[0]);
                return true;
            }
            return false;
        });
    }
    moveDownCodeFragment(id) {
        return this.executeMove(id, index => {
            if (index > -1 && index < this.codeFragments.fragments.length - 1) {
                this.codeFragments.fragments.splice(index + 1, 0, this.codeFragments.fragments.splice(index, 1)[0]);
                return true;
            }
            return false;
        });
    }
    moveToTopCodeFragment(id) {
        return this.executeMove(id, index => {
            if (index > 0) {
                this.codeFragments.fragments.splice(0, 0, this.codeFragments.fragments.splice(index, 1)[0]);
                return true;
            }
            return false;
        });
    }
    moveToBottomCodeFragment(id) {
        return this.executeMove(id, index => {
            if (index > -1 && index < this.codeFragments.fragments.length - 1) {
                this.codeFragments.fragments.splice(this.codeFragments.fragments.length - 1, 0, this.codeFragments.fragments.splice(index, 1)[0]);
                return true;
            }
            return false;
        });
    }
    getAll() {
        return this.codeFragments.fragments;
    }
    getAllWithContent() {
        const headers = this.codeFragments.fragments;
        return headers.map(h => {
            const pair = [h, this.getFragmentContent(h.id)];
            return pair;
        });
    }
    onFragmentsChanged(handler) {
        if (handler) {
            this.fragmentsChangeEvent.push(handler);
        }
    }
    executeMove(id, moveOperation) {
        const index = this.codeFragments.fragments.findIndex(f => f.id === id);
        if (moveOperation(index)) {
            this.fireFragmentsChanged();
            return this.persistCodeFragmentCollection();
        }
        return Promise.resolve();
    }
    saveCodeFragmentContent(content) {
        const id = 'CodeFragmentContent' + this.generateId();
        this.extensionContext.globalState.update(id, new CodeFragmentContent(id, content));
        return id;
    }
    persistCodeFragmentCollection() {
        return this.extensionContext.globalState.update('CodeFragmentCollection', this.codeFragments);
    }
    generateId() {
        return Math.floor((1 + Math.random()) * 0x1000000000000).toString();
    }
    fireFragmentsChanged() {
        this.fragmentsChangeEvent.forEach(h => h());
    }
}
exports.FragmentManager = FragmentManager;
//# sourceMappingURL=fragmentManager.js.map