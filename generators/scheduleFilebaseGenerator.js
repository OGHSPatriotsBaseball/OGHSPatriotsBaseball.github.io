'use strict';

const convertExcelToJsonService = require('../services/convertExcelToJson.service');
const writeToFileService = require('../services/writeToFile.service');

(function buildScheduleFilebase () {
    const sourceFile = 'filebase/OGHS FIELD USE SCHEDULE.xls';

    const statsObject = convertExcelToJsonService.convert(sourceFile);

    const filebaseVarName = 'schedule';
    const statsFilebase = 'filebase/scheduleFilebase.js';

    writeToFileService.writeToFile(filebaseVarName, statsObject, statsFilebase);
})();
