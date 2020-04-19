/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import * as Sentry from '@sentry/browser'
import {User} from '@sentry/types';
import SES from '../src/error/report/SemanticErrorSentry';


describe('Semantic Error Sentry', () => {

  const mockedWarn = () => {}
  beforeEach(() => {
    console.log = mockedWarn;
  })


  it('Should print error with specific scope', async() => {
    const user :User = {
      email : "almerindo.rehem@mail.com",
      id : "12345667889",
      username: "Almerindo Rehem"
    };

    const parent= {};
    const service = 'MY SERVICE 01';
    const args= [{id:3, query:{name:'my name'}}];

    await SES.semanticErrorReport(
      new Error(`Test Error on ${service}`),
      false, //Will not send to Sentry
      parent,
      service,
      args,
      user
    );
    expect.stringContaining('Test Error')
  });

  it('Should send error to sentry with specific scope', async() => {
    const user :User = {
      email : "almerindo.rehem@mail.com",
      id : "12345667889",
      username: "Almerindo Rehem"
    };

    const parent= {};
    const service = 'MY SERVICE 02';
    const args= [{id:3, mutation:{name:'My new Name'}}];

    await SES.semanticErrorReport(
      new Error('Test Error'),
      true, //will send to sentry
      parent,
      service,
      args,
      user );
    expect.stringContaining('Test Error')
  });



});





