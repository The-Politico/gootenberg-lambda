import goot from 'Utils/goot';
import defaultJSONParser from './defaultJSONParser';
import docsAppend from './docsAppend';
import docsCreate from './docsCreate';
import driveCopy from './driveCopy';
import driveExport from './driveExport';
import driveLs from './driveLs';
import driveFiles from './driveFiles';
import driveMove from './driveMove';
import driveRename from './driveRename';
import sheetsAppendRows from './sheetsAppendRows';
import sheetsCreate from './sheetsCreate';

export default {
  drive: {
    copy: (payload) => driveCopy(goot.drive.copy, payload),
    comments: (payload) => defaultJSONParser(goot.drive.comments, payload),
    export: (payload) => driveExport(goot.drive.export, payload),
    files: (payload) => driveFiles(goot.drive.files, payload),
    ls: (payload) => driveLs(goot.drive.ls, payload),
    move: (payload) => driveMove(goot.drive.move, payload),
    rename: (payload) => driveRename(goot.drive.rename, payload),
  },

  docs: {
    append: (payload) => docsAppend(goot.docs.append, payload),
    create: (payload) => docsCreate(goot.docs.create, payload),
    get: (payload) => defaultJSONParser(goot.docs.get, payload),
  },

  sheets: {
    appendRows: (payload) => sheetsAppendRows(goot.sheets.appendRows, payload),
    create: (payload) => sheetsCreate(goot.sheets.create, payload),
    getAll: (payload) => defaultJSONParser(goot.sheets.getAll, payload),
  },

  parse: {
    archie: (payload) => defaultJSONParser(goot.parse.archie, payload),
    table: (payload) => defaultJSONParser(goot.parse.table, payload),
  },
};
