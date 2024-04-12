/* globals navigator, jQuery */

if (!$) var $ = jQuery;
export default class Configurator {
    constructor(containerId = null) {
        console.log('Configurator wird initialisiert');
        if (!containerId) {
            this.container = document.createElement('div');
            this.container.className = 'container mt-5';
            document.body.appendChild(this.container);
        }
        else {
            console.error('Container nicht gefunden:', containerId);
            this.container = document.getElementById(containerId);
        }

        this.configurations = [{
                id: 'common',
                title: 'Common Configuration',
                function: this.createLoRaWANConfig,
                inputs: [
                    { id: 'measurementInterval', label: 'Measurement Interval (seconds)', type: 'number', default: 60 },
                    { id: 'sendCycle', label: 'Send Cycle (measurements before uplink)', type: 'number', default: 10 },
                    { id: 'retransmissions', label: 'Number of Retransmissions', type: 'number', default: 3 }
                ],
                checkboxes: [
                    { id: 'confirmedUplink', label: 'Confirmed Uplink', default: false },
                    { id: 'led', label: 'LED On', default: true },
                    { id: 'adr', label: 'ADR On', default: true },
                    { id: 'continuousVoc', label: 'Continuous VOC', default: false },
                    { id: 'reportInterval', label: 'Report Interval', default: true }
                ]
            },
            {
                id: 'co2',
                title: 'CO2',
                function: this.createCO2LoRaWANConfig,
                inputs: [
                    { id: 'co2Subsamples', label: 'CO2 Subsamples', type: 'number', default: 5 },
                    { id: 'abcCalibration', label: 'ABC Calibration Period (hours)', type: 'number', default: 24 }
                ],
                checkboxes: []
            },
            {
                id: 'reset',
                title: 'Reset',
                function: this.createResetLoRaWANConfig,
                inputs: [
                    { id: 'resetDelay', label: 'Reset Delay (seconds)', type: 'number', default: 10 }
                ],
                checkboxes: [] // Keine Checkboxen benötigt für diese Konfiguration
            },
            {
                id: 'doorSensor',
                title: 'Door Sensor',
                function: this.createDoorSensorLoRaWANConfig,
                inputs: [
                    { id: 'alarmTime', label: 'Alarm Time (seconds)', type: 'number', default: 30 },
                    { id: 'debounceTime', label: 'Hall Sensor Debounce Time (milliseconds)', type: 'number', default: 100 },
                    { id: 'reportInterval', label: 'Door Sensor Status Report Interval (seconds)', type: 'number', default: 3600 }
                ],
                checkboxes: []
            },
            {
                id: 'conditionalTx',
                title: 'Conditional TX',
                function: this.createConditionalTxLoRaWANConfig,
                inputs: [
                    { id: 'co2Threshold', label: 'CO2 Threshold in ppm (65535 to disable)', type: 'number', default: 65535 },
                    { id: 'tempThreshold', label: 'Temperature Threshold in degrees (300 to disable)', type: 'number', default: 300 },
                    { id: 'humidityThreshold', label: 'Relative Humidity Threshold in % (100 to disable)', type: 'number', default: 100 }
                ],
                checkboxes: []
            }
        ];

        this.initUI();
    }

    initUI() {

        console.log('initUI wird aufgerufen');

        const navTabs = document.createElement('ul');
        navTabs.className = 'nav nav-tabs';
        navTabs.id = 'configTabs';
        this.container.appendChild(navTabs);

        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = 'configTabsContent';
        this.container.appendChild(tabContent);

        this.configurations.forEach((config, index) => {
            this.createTab(navTabs, tabContent, config, index);
        });

        const self = this;
        $('#configTabs').on('shown.bs.tab', 'button[data-bs-toggle="tab"]', function(event) {
            const activeTabId = this.ariaControls || $(this).attr('aria-controls');
            const config = self.configurations.find(c => c.id === activeTabId);
            if (config) {
                self.updateHexOutput(config);
            }
        });

        this.createOutputDiv();
        this.updateInitialHexOutput();
    }

    createTab(navTabs, tabContent, config, index) {
        // Erstellt einzelne Tabs
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
        // Erstellt Formularelemente
        const form = document.createElement('form');
        tabPane.appendChild(form);

        config.inputs.forEach(input => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            const label = document.createElement('label');
            label.htmlFor = `${config.id}-${input.id}`;
            label.className = 'form-label';
            label.textContent = input.label;
            const inputElement = document.createElement('input');
            inputElement.type = input.type;
            inputElement.className = 'form-control';
            inputElement.id = `${config.id}-${input.id}`;
            inputElement.value = input.default;
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
            div.appendChild(inputElement);
            div.appendChild(label);
            form.appendChild(div);
        });

        form.addEventListener('input', () => this.updateHexOutput(config));
    }

    createOutputDiv() {
        // Erstellt Ausgabebereich für Hex-String mit Bootstrap Input Group
        const outputDiv = document.createElement('div');
        outputDiv.className = 'mt-3 input-group';

        const outputLabel = document.createElement('label');
        outputLabel.htmlFor = 'hexOutput';
        outputLabel.className = 'form-label';
        outputLabel.textContent = 'Generated Hex String:';
        outputLabel.style.display = 'block'; // Stellen Sie sicher, dass das Label über dem Input angezeigt wird

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
        copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>'; // FontAwesome Copy Icon

        // Event-Listener zum Kopieren des Hex-Wertes
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



    updateInitialHexOutput() {
        // Wählen Sie den ersten Konfigurationstab aus
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


    createLoRaWANConfig(values) {
        let { measurementInterval, sendCycle, confirmedUplink, led, adr, continuousVoc, reportInterval, retransmissions } = values;

        // Stelle sicher, dass die Eingabewerte als Zahlen behandelt werden
        measurementInterval = parseInt(measurementInterval, 10);
        sendCycle = parseInt(sendCycle, 10);
        retransmissions = parseInt(retransmissions, 10);

        // Konvertiere das Messintervall in einen Hexadezimal-String, gepadded auf mindestens 4 Zeichen
        let measurementIntervalHex = measurementInterval.toString(16).padStart(4, '0');
        // Umkehrung der Bytes für das Little-Endian-Format
        measurementIntervalHex = measurementIntervalHex.match(/.{1,2}/g).reverse().join('');

        const sendCycleHex = sendCycle.toString(16).padStart(2, '0');
        const flags = (
            (confirmedUplink ? 1 : 0) << 7 |
            (led ? 1 : 0) << 6 |
            (adr ? 1 : 0) << 5 |
            (continuousVoc ? 1 : 0) << 4 |
            (reportInterval ? 1 : 0) << 3
        ).toString(16).padStart(2, '0');
        const retransmissionsHex = retransmissions.toString(16).padStart(2, '0');
        return `06 87 ${measurementIntervalHex} ${sendCycleHex} ${flags} ${retransmissionsHex}`.toUpperCase().replace(/ /g, '');
    }




    createCO2LoRaWANConfig(values) {
        const co2Subsamples = parseInt(values.co2Subsamples, 10);
        const abcCalibration = parseInt(values.abcCalibration, 10);

        // Konvertiere Werte in Hexadezimalformate
        const co2SubsamplesHex = co2Subsamples.toString(16).padStart(4, '0');
        const abcCalibrationHex = abcCalibration.toString(16).padStart(4, '0');

        // Byte-Reihenfolge von Little Endian berücksichtigen
        const co2SubsamplesHexLE = co2SubsamplesHex.match(/.{1,2}/g).reverse().join('');
        const abcCalibrationHexLE = abcCalibrationHex.match(/.{1,2}/g).reverse().join('');

        // Zusammenstellung des Hex-Strings nach dem vorgegebenen Format
        return `07 81 0000 ${co2SubsamplesHexLE} ${abcCalibrationHexLE}`.toUpperCase().replace(/ /g, '');
    }


    createResetLoRaWANConfig(values) {
        const resetDelay = parseInt(values.resetDelay, 10);
        const resetDelayHex = resetDelay.toString(16).padStart(2, '0').toUpperCase();

        // Magic Number ist festgelegt und muss nicht konvertiert werden
        const magicNumberHex = "F98BD419";

        // Zusammenstellung des Hex-Strings nach dem vorgegebenen Format
        return `06 84 ${magicNumberHex} ${resetDelayHex}`.toUpperCase().replace(/ /g, '');
    }



    createDoorSensorLoRaWANConfig(values) {
        const alarmTime = parseInt(values.alarmTime, 10);
        const debounceTime = parseInt(values.debounceTime, 10);
        const reportInterval = parseInt(values.reportInterval, 10);

        // Konvertierung in Hex und Formatierung als Little-Endian
        const alarmTimeHex = alarmTime.toString(16).padStart(4, '0').match(/.{1,2}/g).reverse().join('');
        const debounceTimeHex = debounceTime.toString(16).padStart(4, '0').match(/.{1,2}/g).reverse().join('');
        const reportIntervalHex = reportInterval.toString(16).padStart(8, '0').match(/.{1,2}/g).reverse().join('');

        // Zusammenstellung des Hex-Strings nach dem vorgegebenen Format
        return `09 86 ${alarmTimeHex} ${debounceTimeHex} ${reportIntervalHex}`.toUpperCase().replace(/ /g, '');
    }


    createConditionalTxLoRaWANConfig(values) {
        const co2Threshold = parseInt(values.co2Threshold, 10);
        const tempThreshold = parseInt(values.tempThreshold, 10);
        const humidityThreshold = parseInt(values.humidityThreshold, 10);

        // Konvertierung in Hex und Formatierung als Little-Endian
        const co2ThresholdHex = co2Threshold.toString(16).padStart(4, '0').match(/.{1,2}/g).reverse().join('');
        const tempThresholdHex = tempThreshold.toString(16).padStart(4, '0').match(/.{1,2}/g).reverse().join('');
        const humidityThresholdHex = humidityThreshold.toString(16).padStart(4, '0').match(/.{1,2}/g).reverse().join('');

        // Zusammenstellung des Hex-Strings nach dem vorgegebenen Format
        return `07 88 ${co2ThresholdHex} ${tempThresholdHex} ${humidityThresholdHex}`.toUpperCase().replace(/ /g, '');
    }
}
