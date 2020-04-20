/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Sentry from '@sentry/node';
import {User} from '@sentry/types';

require('dotenv/config');



class SemanticErrorSentry {
  private tagVersion: string;
  private tagNamePackage: string;
  private static instance : SemanticErrorSentry;
  private pathJSON :string;

  private constructor(){

    this.pathJSON = process.env.PATH_PACKAGE_SON?
      process.env.PATH_PACKAGE_SON:__dirname+'/../../../../../..';

    this.setTagReleaseVersion();
    this.setNamePackage();

    Sentry.init({
      dsn : process.env.SENTRY_DSN,
      environment: process.env.NODE_ENVIRONMENT,
      // release:this.tagVersion
    });

    Sentry.configureScope((scope) => {
      scope.setTag('Release', this.tagVersion)
      scope.setTag('Name Package', this.tagNamePackage)
    });

    console.log('Release', this.tagVersion)
    console.log('Name Package', this.tagNamePackage)
    console.log('NODE_ENV',process.env.NODE_ENV)
    console.log('SENTRY_DSN',process.env.SENTRY_DSN)
    console.log(`__DIRNAME: ${__dirname}`)
  }

  public getSentry(): any{
    return Sentry;
  }

  public static getInstance():SemanticErrorSentry {
    if (!this.instance) {
      this.instance = new SemanticErrorSentry()
    }
    return new SemanticErrorSentry();
  }


/**
 *  This method configures sentry to present more relevant informations
 * @param error The error that will be captured
 * @param isToSend true if is to send to sentry/ false will print on console
 * @param parent used to knows where the uses was before to error
 * @param service used to knows the service used
 * @param args args sent by user
 * @param user who was logged
 */
  public semanticErrorReport(
    error: Error,
    isToSend  = true,
    parent?: any,
    service?: string,
    args?:any,
    user?:User
    ) : Error {
    Sentry.withScope((scope) => {
      if (user) {
        scope.setUser(user);
      }

      scope.setTag('Release', this.tagVersion);

      scope.setTag('Name Package', this.tagNamePackage);

      if (service) {
        scope.setTag('service', service);
      }

      if (parent) {
        scope.setTag('Parent', parent);
      }

      if (args) {
        scope.setExtra('args', args);
      }

      isToSend? Sentry.captureException(error): console.log(error);
    },
    );

    return error;
  }



  private setNamePackage():void{
    try {
      this.tagNamePackage = require(`${this.pathJSON}/package.json`).name
      if (!this.tagNamePackage) {
        throw new Error('Please specify the propertie "name": in package.json');
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }

  private setTagReleaseVersion():void{
    try {
      this.tagNamePackage = require(`${this.pathJSON}/package.json`).version
      if (!this.tagNamePackage) {
        throw new Error('Please specify the propertie "name": in package.json');
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }


}

export default SemanticErrorSentry.getInstance();
