import expect from 'expect.js';
import dotenv from 'dotenv';
import { handler } from '../dist';

import docsCreate from './docs.create';
import docsAppend from './docs.append';
import docsGet from './docs.get';
import driveCopy from './drive.copy';
import driveComments from './drive.comments';
import driveExport from './drive.export';
import driveFiles from './drive.files';
import driveLs from './drive.ls';
import driveMove from './drive.move';
import driveRename from './drive.rename';
import sheetsCreate from './sheets.create';
import sheetsAppendRows from './sheets.appendRows';
import sheetsGetAll from './sheets.getAll';
import parseArchie from './parse.archie';
import parseTable from './parse.table';

dotenv.config();

process.env.TESTING = 'true';

const api = (request) => new Promise((resolve) => {
  handler(request, null, (_, resp) => {
    resolve(resp);
  });
});

const setupRequest = (request) => ({
  headers: {
    Authorization: `Token ${process.env.GOOTENBERG_API_KEY}`,
  },
  httpMethod: 'POST',
  ...request,
});

const TEST_DIRECTORY = '1IGDIVACay48Eb2M4DKtpZyOvvG9LX-Bd';
const TEST_MOVE_TO_DIRECTORY = '1eKkYx_wA1YhlShvACV0UjkWIJAcYPL3A';
const TEST_CONTENT = 'Hello World';
const COMMENTS_DOC = '1pnMChuvcXMQlKRQdDmTXYQK87Nhwy6SghnxS9AnEfXo';
const ARCHIE_DOC = '1aQjMYGik1UaqyyM-Ruyx9QwILwBzmkYyVOqCHR6641U';
const TABLE_SHEET = '1ncKlvgYaKi7u4s9CRiB_xJU9qO-cTjr_yPATT05W8pE';

describe('Testing', () => {
  let doc;
  let docCopy;
  let sheet;
  const now = (new Date()).toISOString();

  it('Creates a doc', async () => {
    const resp = await api(
      setupRequest(docsCreate(now, TEST_DIRECTORY)),
    );

    expect(resp.statusCode).to.be(200);

    const { documentId } = JSON.parse(resp.body);

    doc = documentId;
    expect(typeof documentId).to.be('string');
  });

  it('Appends to a doc', async () => {
    const resp = await api(
      setupRequest(docsAppend(doc, TEST_CONTENT)),
    );

    expect(resp.statusCode).to.be(200);
  });

  it('Reads from a doc', async () => {
    const resp = await api(
      setupRequest(docsGet(doc)),
    );

    expect(resp.statusCode).to.be(200);
    const { body } = JSON.parse(resp.body);
    expect(
      body.content[1].paragraph.elements[0].textRun.content.trim(),
    ).to.be(TEST_CONTENT);
  });

  it('Creates a sheet', async () => {
    const resp = await api(
      setupRequest(sheetsCreate(now, TEST_DIRECTORY)),
    );

    expect(resp.statusCode).to.be(200);

    const { spreadsheetId } = JSON.parse(resp.body);

    sheet = spreadsheetId;
  });

  it('Appends to a sheet', async () => {
    const resp = await api(
      setupRequest(sheetsAppendRows(sheet, TEST_CONTENT)),
    );

    expect(resp.statusCode).to.be(200);
  });

  it('Reads from a sheet', async () => {
    const resp = await api(
      setupRequest(sheetsGetAll(sheet)),
    );

    expect(resp.statusCode).to.be(200);
    const body = JSON.parse(resp.body);
    expect(
      body.valueRanges[0].values[0][0].trim(),
    ).to.be(TEST_CONTENT);
  });

  it('Copies a file', async () => {
    const resp = await api(
      setupRequest(driveCopy(now, doc, TEST_DIRECTORY)),
    );

    expect(resp.statusCode).to.be(200);

    const { id } = JSON.parse(resp.body);

    docCopy = id;
    expect(typeof id).to.be('string');
  });

  it('Exports a file', async () => {
    const resp = await api(
      setupRequest(driveExport(docCopy)),
    );

    expect(resp.statusCode).to.be(200);

    const text = resp.body;
    expect(text.trim()).to.be(TEST_CONTENT);
  });

  it('Finds a file', async () => {
    const resp = await api(
      setupRequest(driveFiles(now)),
    );

    expect(resp.statusCode).to.be(200);

    const files = JSON.parse(resp.body);

    expect(files[0].id).to.be(doc);
  });

  it('Lists files', async () => {
    const resp = await api(
      setupRequest(driveLs(TEST_DIRECTORY)),
    );

    expect(resp.statusCode).to.be(200);

    const files = JSON.parse(resp.body);

    expect(!!files.find(({ id }) => id === doc)).to.be(true);
    expect(!!files.find(({ id }) => id === docCopy)).to.be(true);
  });

  it('Moves files', async () => {
    const resp = await api(
      setupRequest(driveMove(doc, TEST_MOVE_TO_DIRECTORY)),
    );

    expect(resp.statusCode).to.be(200);

    const lsResp = await api(
      setupRequest(driveLs(TEST_MOVE_TO_DIRECTORY)),
    );

    expect(lsResp.statusCode).to.be(200);

    const files = JSON.parse(lsResp.body);
    expect(!!files.find(({ id }) => id === doc)).to.be(true);
  });

  it('Renames a file', async () => {
    const resp = await api(
      setupRequest(driveRename(now, doc)),
    );

    expect(resp.statusCode).to.be(200);
  });

  it('Gets comments for a doc', async () => {
    const resp = await api(
      setupRequest(driveComments(COMMENTS_DOC)),
    );

    expect(resp.statusCode).to.be(200);

    const comments = JSON.parse(resp.body);
    expect(comments[0].content).to.be('Foo Bar');
  });

  it('Parses archieml data', async () => {
    const resp = await api(
      setupRequest(parseArchie(ARCHIE_DOC)),
    );

    expect(resp.statusCode).to.be(200);

    const data = JSON.parse(resp.body);

    expect(data).to.be.an('object');
    expect(data.Key).to.be('Value');
    expect(data.Key2).to.be('Value2');

    expect(data.arr).to.be.an('array');
    expect(data.arr).to.have.length(3);
    expect(data.arr[0].Key).to.be('value');

    expect(data.Content).to.be(
      'Lorem [ipsum](https://example.com) dolor **sit** amet, *consectetur* '
      + 'adipisicing ***elit***, sed do _eiusmod_ **[tempor incididunt]'
      + '(https://example.com)** ut labore et dolore magna aliqua. Ut enim ad '
      + 'minim veniam, quis nostrud exercitation ullamco laboris nisi ut '
      + 'aliquip ex ea commodo consequat. Duis aute irure dolor in '
      + 'reprehenderit in voluptate velit esse cillum dolore eu '
      + 'fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
      + 'proident, sunt in culpa qui officia deserunt mollit anim id est '
      + 'laborum.',
    );

    expect(data.List).to.be.an('array');
    expect(data.List).to.have.length(3);
    expect(data.List[0]).to.be('One');

    expect(data.Blocks).to.be(
      '\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do '
      + 'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim '
      + 'ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut '
      + 'aliquip ex ea commodo consequat. Duis aute irure dolor in '
      + 'reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla '
      + 'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in '
      + 'culpa qui officia deserunt mollit anim id est laborum.\n\n**Lorem '
      + 'ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod '
      + 'tempor incididunt ut labore et dolore magna aliqua. **\n\nExcepteur '
      + 'sint occaecat cupidatat non proident, sunt in culpa qui officia '
      + 'deserunt mollit anim id est laborum. Ut enim ad minim veniam, quis '
      + 'nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo '
      + 'consequat.\n\n[Read More: A Headline Here](https://example.com)'
      + '\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse '
      + 'cillum dolore eu fugiat nulla pariatur.',
    );
  });

  it('Parses sheet table data', async () => {
    const resp = await api(
      setupRequest(parseTable(TABLE_SHEET)),
    );

    expect(resp.statusCode).to.be(200);

    const data = JSON.parse(resp.body);

    expect(data).to.be.an('object');
    expect(data).to.have.property('Status');
    expect(data.Status[0]).to.have.property('Member');
    expect(data.Status[0].Member).to.be('McClure');

    expect(data).to.have.property('WeIrD N8me');
  });

  it('Responds 404 on unknown endpoint', async () => {
    const resp = await api(
      setupRequest({
        path: 'test/bad/',
      }),
    );

    expect(resp.statusCode).to.be(404);
    expect(resp.body).to.be(
      'test is not a valid Gootenberg service. '
      + 'Use one of [docs, drive, parse, sheets].',
    );
  });

  it('Responds 400 on malformed body', async () => {
    const resp = await api(
      setupRequest({
        path: 'drive/export/',
        body: {},
      }),
    );

    expect(resp.statusCode).to.be(400);
    expect(resp.body).to.be('Argument #1: Expected string but got null');
  });

  it('Responds 403 on incorrect token', async () => {
    const resp = await api(
      {
        headers: {
          Authorization: 'Token 12345',
        },
        httpMethod: 'POST',
        path: 'drive/export',
        body: {
          id: COMMENTS_DOC,
        },
      },
    );

    expect(resp.statusCode).to.be(403);
    expect(resp.body).to.be('Invalid Auth Token Provided');
  });
});
