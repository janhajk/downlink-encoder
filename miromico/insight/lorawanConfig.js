/* globals navigator, $ */

// Konfigurations-Typen definieren
const configurations = [{
        id: 'common',
        title: 'Common Configuration',
        function: createLoRaWANConfig,
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
        function: createCO2LoRaWANConfig,
        inputs: [
            { id: 'co2Subsamples', label: 'CO2 Subsamples', type: 'number', default: 5 },
            { id: 'abcCalibration', label: 'ABC Calibration Period (hours)', type: 'number', default: 24 }
        ],
        checkboxes: []
    },
    {
        id: 'reset',
        title: 'Reset',
        function: createResetLoRaWANConfig,
        inputs: [
            { id: 'resetDelay', label: 'Reset Delay (seconds)', type: 'number', default: 10 }
        ],
        checkboxes: [] // Keine Checkboxen benötigt für diese Konfiguration
    },
    {
        id: 'doorSensor',
        title: 'Door Sensor',
        function: createDoorSensorLoRaWANConfig,
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
        function: createConditionalTxLoRaWANConfig,
        inputs: [
            { id: 'co2Threshold', label: 'CO2 Threshold in ppm (65535 to disable)', type: 'number', default: 65535 },
            { id: 'tempThreshold', label: 'Temperature Threshold in degrees (300 to disable)', type: 'number', default: 300 },
            { id: 'humidityThreshold', label: 'Relative Humidity Threshold in % (100 to disable)', type: 'number', default: 100 }
        ],
        checkboxes: []
    }

    // Weitere Konfigurationen können hier hinzugefügt werden
];

// lorawanConfig.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mainContainer');

    // Tabs und Inhalte erstellen
    const navTabs = document.createElement('ul');
    navTabs.className = 'nav nav-tabs';
    navTabs.id = 'configTabs';
    container.appendChild(navTabs);

    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = 'configTabsContent';
    container.appendChild(tabContent);

    configurations.forEach((config, index) => {
        // Tab erstellen
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

        // Inhaltsbereich für den Tab erstellen
        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        tabPane.id = config.id;
        tabPane.role = 'tabpanel';
        tabPane.ariaLabelledby = `${config.id}-tab`;
        tabContent.appendChild(tabPane);

        // Formularelemente für diesen Tab erstellen
        createFormElements(tabPane, config);

    });

    // Bootstrap Tabs initialisieren
    new bootstrap.Tab(document.querySelector('.nav-link.active'));

    // Ausgabebereich für den Hex-String erstellen
    const outputDiv = document.createElement('div');
    outputDiv.className = 'mt-3';
    const outputLabel = document.createElement('label');
    outputLabel.htmlFor = 'hexOutput';
    outputLabel.className = 'form-label';
    outputLabel.textContent = 'Generated Hex String:';
    const outputInput = document.createElement('input');
    outputInput.type = 'text';
    outputInput.className = 'form-control';
    outputInput.id = 'hexOutput';
    outputInput.readOnly = true;
    outputDiv.appendChild(outputLabel);
    outputDiv.appendChild(outputInput);
    container.appendChild(outputDiv);

    initializeHexOutput();


});

function initializeHexOutput() {
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
        const config = configurations.find(c => c.id === activeTab.id);
        if (config) {
            updateHexOutput(config);
        }
    }
}

// Formularelemente für jeden Konfigurationstyp erstellen
function createFormElements(tabPane, config) {
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

    // Event Listener hinzufügen, um den Hex-String bei Änderungen zu aktualisieren
    form.addEventListener('input', () => updateHexOutput(config));
}

// Hex-String basierend auf dem aktiven Tab und den Formulareingaben aktualisieren
function updateHexOutput(config) {
    const values = {};
    config.inputs.forEach(input => {
        values[input.id] = document.getElementById(`${config.id}-${input.id}`).value;
    });
    config.checkboxes.forEach(checkbox => {
        values[checkbox.id] = document.getElementById(`${config.id}-${checkbox.id}`).checked;
    });
    const hexString = config.function(values);
    document.getElementById('hexOutput').value = hexString;
}

export function copyToClipboard(hexString) {
    navigator.clipboard.writeText(hexString).then(() => {
        alert("Copied to clipboard: " + hexString);
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}


function createLoRaWANConfig(values) {
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


function createCO2LoRaWANConfig(values) {
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


function createResetLoRaWANConfig(values) {
    const resetDelay = parseInt(values.resetDelay, 10);
    const resetDelayHex = resetDelay.toString(16).padStart(2, '0').toUpperCase();

    // Magic Number ist festgelegt und muss nicht konvertiert werden
    const magicNumberHex = "F98BD419";

    // Zusammenstellung des Hex-Strings nach dem vorgegebenen Format
    return `06 84 ${magicNumberHex} ${resetDelayHex}`.toUpperCase().replace(/ /g, '');
}



function createDoorSensorLoRaWANConfig(values) {
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


function createConditionalTxLoRaWANConfig(values) {
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
