'use strict';

const convertExcelToJsonService = require('../services/convertExcelToJson.service');
const writeToFileService = require('../services/writeToFile.service');

(function buildSchedulesFilebase () {
    const sourceFile = 'filebase/OGHS FIELD USE SCHEDULE.xls';

    const statsObject = convertExcelToJsonService.convert(sourceFile);

    const filebaseVarName = 'stats';
    const statsFilebase = 'filebase/scheduleFilebase.js';

    writeToFileService.writeToFile(filebaseVarName, statsObject, statsFilebase);
})();
