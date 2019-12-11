function scheduleController(schedule) {

    function addSelectorOptions(monthSelector, document) {
        Object.keys(schedule).forEach(month => {
            const monthOption = document.createElement('option');
            monthOption.value = month;
            const monthTextNode = document.createTextNode(month);
            monthOption.appendChild(monthTextNode);
            monthSelector.appendChild(monthOption);
        });
    }

    return {
        addSelectorOptions
    };
}

module.exports = scheduleController;