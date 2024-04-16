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
        this.createOutputDiv();
        this.bindTabChangeEvent();
    }

    createNavTabs() {
        const navTabs = document.createElement('ul');
        navTabs.className = 'nav nav-tabs';
        navTabs.id = 'configTabs';
        return navTabs;
    }

    createTabContent() {
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = 'configTabsContent';
        return tabContent;
    }

    createOutputDiv() {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'mt-3 input-group';
        const outputLabel = document.createElement('label');
        outputLabel.htmlFor = 'hexOutput';
        outputLabel.className = 'form-label';
        outputLabel.textContent = 'Generated Hex String:';
        const outputInput = document.createElement('input');
        outputInput.type = 'text';
        outputInput.className = 'form-control';
        outputInput.id = 'hexOutput';
        outputInput.readOnly = true;

        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-outline-secondary';
        copyButton.innerHTML = '<i class="fa fa-copy"></i>';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(outputInput.value)
                .then(() => alert('Copied to clipboard'))
                .catch(err => console.error('Error copying text:', err));
        };

        outputDiv.appendChild(outputLabel);
        outputDiv.appendChild(outputInput);
        outputDiv.appendChild(copyButton);
        this.container.appendChild(outputDiv);
    }

    bindTabChangeEvent() {
        $('#configTabs').on('shown.bs.tab', 'button[data-bs-toggle="tab"]', (event) => {
            const activeTabId = $(event.target).attr('aria-controls');
            this.updateHexOutput(this.configurations.find(c => c.id === activeTabId));
        });
    }

    updateHexOutput(config) {
        if (!config) return;
        // Logic to generate and display hex output
    }
}
