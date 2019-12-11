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

describe('Schedule Controller Tests', () => {
    let scheduleController;
    const monthSelectorMock = {
        appendChild,
        children: [],
        type: 'select'
    };
    const documentMock = {
        createElement,
        createTextNode
    };

    describe('addSelectorOptions', () => {
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
});