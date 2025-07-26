// base.js
/* global navigator, jQuery */

if (!$) var $ = jQuery;

export class LoRaWANConfigBase {
    constructor(containerId = null, configurations) {
        this.configurations = configurations;
        this.containerId = containerId;
        this.initContainer();
        this.initUI();
    }

    initContainer() {
        if (this.containerId) {
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.error('Container nicht gefunden:', this.containerId);
                this.createDefaultContainer();
            }
            else {
                console.log('Verwendet vorhandenen Container:', this.containerId);
            }
        }
        else {
            this.createDefaultContainer();
        }
    }

    createDefaultContainer() {
        this.container = document.createElement('div');
        this.container.className = 'container mt-5';
        document.body.appendChild(this.container);
    }

    initUI() {
        this.container.innerHTML = '';
        this.navTabs = this.createNavTabs();
        this.tabContent = this.createTabContent();
        this.container.appendChild(this.navTabs);
        this.container.appendChild(this.tabContent);

        const self = this;
        this.configurations.forEach((config, index) => {
            this.createTab(self.navTabs, self.tabContent, config, index);
        });

        this.createOutputDiv();
        this.bindTabChangeEvent();
        this.updateInitialHexOutput();

    }

    createNavTabs() {
        const navTabs = document.createElement('ul');
        navTabs.className = 'nav nav-tabs';
        navTabs.id = 'configTabs';
        navTabs.style.setProperty('list-style', 'none', 'important');
        return navTabs;
    }

    createTabContent() {
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = 'configTabsContent';

        return tabContent;
    }

    createTab(navTabs, tabContent, config, index) {
        const tab = document.createElement('li');
        tab.className = 'nav-item';
        tab.role = 'presentation';

        const tabLink = document.createElement('button');
        tabLink.className = `nav-link ${index === 0 ? 'active' : ''}`;
        tabLink.id = `${config.id}-tab`;
        tabLink.dataset.bsToggle = 'tab';
        tabLink.dataset.bsTarget = `#${config.id}`;
        tabLink.type = 'button';
        tabLink.role = 'tab';
        tabLink.ariaControls = config.id;
        tabLink.ariaSelected = index === 0 ? 'true' : 'false';
        tabLink.textContent = config.title;
        tab.appendChild(tabLink);
        navTabs.appendChild(tab);

        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        tabPane.id = config.id;
        tabPane.role = 'tabpanel';
        tabPane.ariaLabelledby = `${config.id}-tab`;
        tabContent.appendChild(tabPane);

        this.createFormElements(tabPane, config);
    }

    createFormElements(tabPane, config) {
        const form = document.createElement('form');
        tabPane.appendChild(form);

        config.inputs.forEach(input => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            const label = document.createElement('label');
            label.htmlFor = `${config.id}-${input.id}`;
            label.className = 'form-label';
            label.textContent = input.label;

            let inputElement;
            if (input.type === 'select') {
                inputElement = document.createElement('select');

                // Unterscheiden, ob input.options ein Array oder ein Objekt ist
                if (Array.isArray(input.options)) {
                    // Behandlung, wenn es ein Array ist
                    input.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        if (option === input.default) {
                            optionElement.selected = true;
                        }
                        inputElement.appendChild(optionElement);
                    });
                }
                else if (typeof input.options === 'object') {
                    // Behandlung, wenn es ein Objekt ist
                    Object.entries(input.options).forEach(([key, value]) => {
                        const optionElement = document.createElement('option');
                        optionElement.value = key;
                        optionElement.textContent = value;
                        if (key === input.default) {
                            optionElement.selected = true;
                        }
                        inputElement.appendChild(optionElement);
                    });
                }
            }

            else {
                inputElement = document.createElement('input');
                inputElement.type = input.type;
                inputElement.value = input.default;
            }

            inputElement.className = 'form-control';
            inputElement.id = `${config.id}-${input.id}`;
            div.appendChild(label);
            div.appendChild(inputElement);
            form.appendChild(div);
        });

        config.checkboxes.forEach(checkbox => {
            const div = document.createElement('div');
            div.className = 'mb-3 form-check';
            const label = document.createElement('label');
            label.htmlFor = `${config.id}-${checkbox.id}`;
            label.className = 'form-check-label';
            label.textContent = checkbox.label;

            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.className = 'form-check-input';
            inputElement.id = `${config.id}-${checkbox.id}`;
            inputElement.checked = checkbox.default;
            inputElement.style.setProperty('width', '15px', 'important');
            div.appendChild(inputElement);
            div.appendChild(label);
            form.appendChild(div);
        });

        form.addEventListener('input', () => this.updateHexOutput(config));
    }

    createOutputDiv() {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'mt-3 input-group';

        const outputLabel = document.createElement('label');
        outputLabel.htmlFor = 'hexOutput';
        outputLabel.className = 'form-label';
        outputLabel.textContent = 'Generated Hex String:';
        outputLabel.style.display = 'block';

        const outputInputGroup = document.createElement('div');
        outputInputGroup.className = 'input-group';

        const outputInput = document.createElement('input');
        outputInput.type = 'text';
        outputInput.className = 'form-control';
        outputInput.id = 'hexOutput';
        outputInput.readOnly = true;

        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = 'input-group-append';

        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-outline-secondary';
        copyButton.type = 'button';
        copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';

        copyButton.onclick = () => {
            navigator.clipboard.writeText(outputInput.value).then(() => {
                alert('Copied to clipboard: ' + outputInput.value);
            }, (error) => {
                alert('Error copying text: ' + error);
            });
        };

        inputGroupAppend.appendChild(copyButton);
        outputInputGroup.appendChild(outputInput);
        outputInputGroup.appendChild(inputGroupAppend);
        outputDiv.appendChild(outputLabel);
        outputDiv.appendChild(outputInputGroup);
        this.container.appendChild(outputDiv);
    }

    bindTabChangeEvent() {
        const self = this;
        $('#configTabs').on('shown.bs.tab', 'button[data-bs-toggle="tab"]', function(event) {
            const activeTabId = this.ariaControls || $(this).attr('aria-controls');
            const config = self.configurations.find(c => c.id === activeTabId);
            if (config) {
                self.updateHexOutput(config);
            }
        });
    }

    updateInitialHexOutput() {
        const initialConfig = this.configurations[0];
        if (initialConfig) {
            this.updateHexOutput(initialConfig);
        }
    }

    updateHexOutput(config) {
        const values = {};
        config.inputs.forEach(input => {
            const inputElement = document.getElementById(`${config.id}-${input.id}`);
            values[input.id] = inputElement ? inputElement.value : input.default;
        });
        config.checkboxes.forEach(checkbox => {
            const checkboxElement = document.getElementById(`${config.id}-${checkbox.id}`);
            values[checkbox.id] = checkboxElement ? checkboxElement.checked : checkbox.default;
        });

        const hexString = config.function(values);
        document.getElementById('hexOutput').value = hexString;
    }
}
