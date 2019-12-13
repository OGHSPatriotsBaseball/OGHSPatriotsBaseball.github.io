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

    function buildSchedule(tableHeader, tableBody, document, selectedMonth) {
        removeAllChildNodes(tableHeader);
        removeAllChildNodes(tableBody);

        const scheduleForSelectedMonth = schedule[selectedMonth];

        if (!scheduleForSelectedMonth) {
            return;
        }

        const teamHeaderNode = document.createElement('th');
        const teamHeaderTextNode = document.createTextNode('team');
        teamHeaderNode.appendChild(teamHeaderTextNode);
        tableHeader.appendChild(teamHeaderNode);

        for (let i = 1; i <= 30; i++) {
            const dateHeaderNode = document.createElement('th');
            const dateHeaderTextNode = document.createTextNode(`${i}`);
            dateHeaderNode.appendChild(dateHeaderTextNode);
            tableHeader.appendChild(dateHeaderNode);
        }
    }

    return {
        addSelectorOptions,
        buildSchedule
    };
}

module.exports = scheduleController;