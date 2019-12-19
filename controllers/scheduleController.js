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

        const headerRow = document.createElement('tr');
        const teamHeaderNode = document.createElement('th');
        const teamHeaderTextNode = document.createTextNode('team');
        teamHeaderNode.appendChild(teamHeaderTextNode);
        headerRow.appendChild(teamHeaderNode);

        const currentYear = (new Date()).getFullYear();
        const currentMonth = (new Date(`${selectedMonth} ${currentYear}`)).getMonth() + 1;
        const numberOfDaysInCurrentMonth = (new Date(currentYear, currentMonth, 0)).getDate();

        for (let i = 1; i <= numberOfDaysInCurrentMonth; i++) {
            const dateHeaderNode = document.createElement('th');
            const dateHeaderTextNode = document.createTextNode(`${i}`);
            dateHeaderNode.appendChild(dateHeaderTextNode);
            headerRow.appendChild(dateHeaderNode);
        }

        tableHeader.appendChild(headerRow);
    }

    return {
        addSelectorOptions,
        buildSchedule
    };
}

module.exports = scheduleController;