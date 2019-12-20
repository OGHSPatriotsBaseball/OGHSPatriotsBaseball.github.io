const assert = require('assert');
const sinon = require('sinon');
const scheduleControllerConstructor = require('../controllers/scheduleController');

function appendChild(childNode) {
    this.children.push(childNode);
}

function createElement(elementName) {
    return {
        appendChild,
        children: [],
        type: elementName
    }
}

function createTextNode(text) {
    return {
        text
    };
}

function hasChildNodes() {
    this.firstChild = this.children[0];
    return this.children.length > 0;
}

function removeChild(childToRemove) {
    let indexOfChildToRemove = -1;

    this.children.forEach((childNode, index) => {
        if (childNode === childToRemove) {
            indexOfChildToRemove = index;
        }
    });

    if (indexOfChildToRemove >= 0) {
        this.children.splice(indexOfChildToRemove, 1);
        this.firstChild = this.children[0];
    }
}

function appendHeadersForMonth(expectedChildren, daysInTheMonth) {
    for (let i = 1; i <= daysInTheMonth; i++) {
        expectedChildren.push({
            appendChild,
            children: [{ text: `${i}` }],
            type: 'th'
        });
    }
}

function createBodyForMonth(scheduleForMonth, daysInTheMonth) {
    let expectedChildren = [];
    scheduleForMonth.forEach(scheduleForATeam => {
        const rowForATeam = {
            appendChild,
            children: [
                {
                    appendChild,
                    children: [{ text: `${scheduleForATeam.TEAM}` }],
                    type: 'td'
                }
            ],
            type: 'tr'
        };
        expectedChildren.push(rowForATeam);
        for (let i = 1; i <= daysInTheMonth; i++) {
            const fieldUsage = scheduleForATeam[i] || ''; 
            rowForATeam.children.push({
                appendChild,
                children: [{ text: fieldUsage }],
                type: 'td'
            });
        }
    });

    return expectedChildren;
}

describe('Schedule Controller Tests', () => {
    let scheduleController;
    const documentMock = {
        createElement,
        createTextNode
    };

    describe('addSelectorOptions', () => {
        let monthSelectorMock;

        beforeEach(() => {
            monthSelectorMock = {
                appendChild,
                children: [],
                type: 'select'
            };
        });

        it('should add options for the selector when there is an empty schedule', () => {
            const schedule = {};
            const expectedChildren = [];
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.addSelectorOptions(monthSelectorMock, documentMock);


            assert.equal(JSON.stringify(monthSelectorMock.children), JSON.stringify(expectedChildren));
        });

        it('should add options for the selector when there are months in the schedule', () => {
            const schedule = {
                month1: [],
                month2: [],
                month3: []
            };
            const expectedChildren = [
                {
                    appendChild,
                    children: [{ text: 'month1' }],
                    type: 'option',
                    value: 'month1'
                },
                {
                    appendChild,
                    children: [{ text: 'month2' }],
                    type: 'option',
                    value: 'month2'
                },
                {
                    appendChild,
                    children: [{ text: 'month3' }],
                    type: 'option',
                    value: 'month3'
                }
            ];
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.addSelectorOptions(monthSelectorMock, documentMock);

            assert.equal(JSON.stringify(monthSelectorMock.children), JSON.stringify(expectedChildren));
        });
    });

    describe('buildSchedule', () => {
        let tableHeaderMock;
        let tableBodyMock;
        let realDateClass;
        let dateClassMock;
        let dateObjectMock;
        let numberOfDaysInCurrentMonth;
        const currentYear = 1996;
        const currentMonth = 2;
        const emptySchedule = {};
        const schedule = {
            month1: [
                {
                    TEAM: 'team1',
                    1: 'VAR',
                    7: 'JV'
                },
                {
                    TEAM: 'team2',
                    2: 'JV',
                    3: 'BC'
                }
            ],
            month2: [
                {
                    TEAM: 'team2',
                    4: 'VAR',
                    20: 'VAR'
                },
                {
                    TEAM: 'team3',
                    6: 'JV',
                    9: 'JV'
                }
            ]
        };

        beforeEach(() => {
            tableHeaderMock = {
                appendChild,
                hasChildNodes,
                removeChild,
                children: [],
                type: 'thead'
            };
            tableBodyMock = {
                appendChild,
                hasChildNodes,
                removeChild,
                children: [],
                type: 'tbody'
            };

            realDateClass = Date;

            numberOfDaysInCurrentMonth = 30;
            dateObjectMock = {
                getFullYear: sinon.spy(function () {
                    return currentYear;
                }),
                getMonth: sinon.spy(function () {
                    return currentMonth;
                }),
                getDate: sinon.spy(function () {
                    return numberOfDaysInCurrentMonth;
                })
            };
            dateClassMock = sinon.spy(function () {
                return dateObjectMock;
            });
            Date = dateClassMock;
        });

        afterEach(() => {
            Date = realDateClass;
        });

        it('should clear the child elements from the table header and body', () => {
            tableHeaderMock.appendChild(createElement('tr'));
            tableHeaderMock.appendChild(createElement('tr'));
            tableBodyMock.appendChild(createElement('tr'));
            const expectedChildren = [];
            scheduleController = scheduleControllerConstructor(emptySchedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock);

            assert.equal(JSON.stringify(tableHeaderMock.children), JSON.stringify(expectedChildren));
            assert.equal(JSON.stringify(tableBodyMock.children), JSON.stringify(expectedChildren));
        });

        it('should not build a schedule if the selected month does not exist in the schedule', () => {
            const selectedMonthThatDoesNotExist = 'Nonexistant Month'
            const expectedChildren = [];
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock, selectedMonthThatDoesNotExist);

            assert.equal(JSON.stringify(tableHeaderMock.children), JSON.stringify(expectedChildren));
            assert.equal(JSON.stringify(tableBodyMock.children), JSON.stringify(expectedChildren));
        });

        it('should call out to the date class when constructing the schedule', () => {
            const selectedMonth = 'month1';
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock, selectedMonth);

            assert.equal(dateClassMock.callCount, 3);
            assert(dateClassMock.calledWithNew());
            assert.equal(dateClassMock.args[0][0], undefined);
            assert.equal(dateObjectMock.getFullYear.callCount, 1);
            assert.equal(dateClassMock.args[1][0], `${selectedMonth} ${currentYear}`);
            assert.equal(dateObjectMock.getMonth.callCount, 1);
            assert.equal(dateClassMock.args[2][0], currentYear);
            assert.equal(dateClassMock.args[2][1], currentMonth + 1);
            assert.equal(dateClassMock.args[2][2], 0);
            assert.equal(dateObjectMock.getDate.callCount, 1);
        });

        it('should build the table header for the selected 30 day month', () => {
            const selectedMonth = 'month1';
            const expectedChildren = [
                {
                    appendChild,
                    children: [
                        {
                            appendChild,
                            children: [{ text: 'TEAM' }],
                            type: 'th'
                        }
                    ],
                    type: 'tr'
                }
            ];
            appendHeadersForMonth(expectedChildren[0].children, numberOfDaysInCurrentMonth)
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock, selectedMonth);

            assert.equal(JSON.stringify(tableHeaderMock.children), JSON.stringify(expectedChildren));
        });

        it('should build the table header for the selected 31 day month', () => {
            const selectedMonth = 'month2';
            const expectedChildren = [
                {
                    appendChild,
                    children: [
                        {
                            appendChild,
                            children: [{ text: 'TEAM' }],
                            type: 'th'
                        }
                    ],
                    type: 'tr'
                }
            ];
            numberOfDaysInCurrentMonth = 31;
            appendHeadersForMonth(expectedChildren[0].children, numberOfDaysInCurrentMonth)
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock, selectedMonth);

            assert.equal(JSON.stringify(tableHeaderMock.children), JSON.stringify(expectedChildren));
        });

        it('should build the table body for the selected 30 day month', () => {
            const selectedMonth = 'month1';
            const expectedChildren = createBodyForMonth(schedule[selectedMonth], numberOfDaysInCurrentMonth);
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock, selectedMonth);

            assert.equal(JSON.stringify(tableBodyMock.children), JSON.stringify(expectedChildren));
        });

        it('should build the table body for the selected 31 day month', () => {
            const selectedMonth = 'month2';
            numberOfDaysInCurrentMonth = 31;
            const expectedChildren = createBodyForMonth(schedule[selectedMonth], numberOfDaysInCurrentMonth);
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, documentMock, selectedMonth);

            assert.equal(JSON.stringify(tableBodyMock.children), JSON.stringify(expectedChildren));
        });
    });
});