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

    function buildSchedule(tableHeader, tableBody) {
        while(tableHeader.hasChildNodes()) {
            tableHeader.removeChild(tableHeader.firstChild);
        }
        while(tableBody.hasChildNodes()) {
            tableBody.removeChild(tableBody.firstChild);
        }
    }

    return {
        addSelectorOptions,
        buildSchedule
    };
}

module.exports = scheduleController;