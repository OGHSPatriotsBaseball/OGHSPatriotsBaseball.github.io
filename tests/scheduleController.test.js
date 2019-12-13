const assert = require('assert');
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
                    children: [{text: 'month1'}],
                    type: 'option',
                    value: 'month1'
                },
                {
                    appendChild,
                    children: [{text: 'month2'}],
                    type: 'option',
                    value: 'month2'
                },
                {
                    appendChild,
                    children: [{text: 'month3'}],
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
        });

        it('should clear the child elements from the table header and body', () => {
            tableHeaderMock.appendChild(createElement('tr'));
            tableHeaderMock.appendChild(createElement('tr'));
            tableBodyMock.appendChild(createElement('tr'));
            const schedule = {};
            const expectedChildren = [];
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock);

            assert.equal(JSON.stringify(tableHeaderMock.children), JSON.stringify(expectedChildren));
            assert.equal(JSON.stringify(tableBodyMock.children), JSON.stringify(expectedChildren));
        });
        
        it('should build the table header for the selected month', () => {
            const schedule = {
                month1: [
                    {
                        team: 'team1',
                        1: 'VAR',
                        7: 'JV'
                    },
                    {
                        team: 'team2',
                        2: 'JV',
                        3: 'BC'
                    }
                ],
                month2: [
                    {
                        team: 'team2',
                        4: 'VAR',
                        20: 'VAR'
                    },
                    {
                        team: 'team3',
                        6: 'JV',
                        9: 'JV'
                    }
                ]
            };
            const selectedMonth = 'month2';
            const expectedChildren = [
                {
                    appendChild,
                    // children: [{text: 'month1'}],
                    type: 'th'
                },
                {
                    appendChild,
                    // children: [{text: 'month2'}],
                    type: 'th'
                },
                {
                    appendChild,
                    // children: [{text: 'month3'}],
                    type: 'th'
                }
            ];
            scheduleController = scheduleControllerConstructor(schedule);

            scheduleController.buildSchedule(tableHeaderMock, tableBodyMock, selectedMonth);

            assert.equal(JSON.stringify(tableHeaderMock.children), JSON.stringify(expectedChildren));
        });
    });
});