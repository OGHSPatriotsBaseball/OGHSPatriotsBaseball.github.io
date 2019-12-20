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

    function buildScheduleHeader(document, numberOfDaysInCurrentMonth, tableHeader) {
        const headerRow = document.createElement('tr');
        const teamHeaderNode = document.createElement('th');
        const teamHeaderTextNode = document.createTextNode('team');
        teamHeaderNode.appendChild(teamHeaderTextNode);
        headerRow.appendChild(teamHeaderNode);
        for (let dayOfTheMonth = 1; dayOfTheMonth <= numberOfDaysInCurrentMonth; dayOfTheMonth++) {
            const dateHeaderNode = document.createElement('th');
            const dateHeaderTextNode = document.createTextNode(`${dayOfTheMonth}`);
            dateHeaderNode.appendChild(dateHeaderTextNode);
            headerRow.appendChild(dateHeaderNode);
        }
        tableHeader.appendChild(headerRow);
    }

    function buildScheduleBody(scheduleForSelectedMonth, document, numberOfDaysInCurrentMonth, tableBody) {
        scheduleForSelectedMonth.forEach(scheduleForATeam => {
            const teamRow = document.createElement('tr');
            const teamNameNode = document.createElement('td');
            const teamNameTextNode = document.createTextNode(scheduleForATeam.team);
            teamNameNode.appendChild(teamNameTextNode);
            teamRow.appendChild(teamNameNode);
            for (let dayOfTheMonth = 1; dayOfTheMonth <= numberOfDaysInCurrentMonth; dayOfTheMonth++) {
                const fieldUsage = scheduleForATeam[dayOfTheMonth] || '';
                const fieldUsageNode = document.createElement('td');
                const fieldUsageTextNode = document.createTextNode(fieldUsage);
                fieldUsageNode.appendChild(fieldUsageTextNode);
                teamRow.appendChild(fieldUsageNode);
            }
            tableBody.appendChild(teamRow);
        });
    }

    function buildSchedule(tableHeader, tableBody, document, selectedMonth) {
        removeAllChildNodes(tableHeader);
        removeAllChildNodes(tableBody);

        const scheduleForSelectedMonth = schedule[selectedMonth];

        if (!scheduleForSelectedMonth) {
            return;
        }

        const currentYear = (new Date()).getFullYear();
        const currentMonth = (new Date(`${selectedMonth} ${currentYear}`)).getMonth() + 1;
        const numberOfDaysInCurrentMonth = (new Date(currentYear, currentMonth, 0)).getDate();

        buildScheduleHeader(document, numberOfDaysInCurrentMonth, tableHeader);
        buildScheduleBody(scheduleForSelectedMonth, document, numberOfDaysInCurrentMonth, tableBody);
    }

    return {
        addSelectorOptions,
        buildSchedule
    };
}

module.exports = scheduleController;
