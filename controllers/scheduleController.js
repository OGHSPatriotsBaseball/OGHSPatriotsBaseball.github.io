function scheduleController(schedule) {

    function createNewMonthOption(document, month) {
        const monthOption = document.createElement('option');
        monthOption.value = month;
        const monthTextNode = document.createTextNode(month);
        monthOption.appendChild(monthTextNode);
        return monthOption;
    }

    function addSelectorOptions(monthSelector, document) {
        Object.keys(schedule).forEach(month => {
            const monthOption = createNewMonthOption(document, month)
            monthSelector.appendChild(monthOption);
        });
    }

    function removeAllChildNodes(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
    }

    function buildSchedule(tableHeader, tableBody) {
        removeAllChildNodes(tableHeader);
        removeAllChildNodes(tableBody);

    }

    return {
        addSelectorOptions,
        buildSchedule
    };
}

module.exports = scheduleController;