import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneChoiceGroup } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import AnonymousPoll from './components/AnonymousPoll';
import { IAnonymousPollProps, IPollData } from './components/IAnonymousPollProps';
import { set } from '@microsoft/sp-lodash-subset';

export interface IAnonymousPollWebPartProps {
  question: string;
  color: string;
  usersVoted: string[];
  pollData: IPollData[];
  options: string;
  showResultToUser: boolean;
  pollStarted: boolean;
  pollAction: string;
}

const LOG_SOURCE: string = `AnonymousPollWebPart`;

export default class AnonymousPollWebPart extends BaseClientSideWebPart<IAnonymousPollWebPartProps> {

  public render(): void {

    const element: React.ReactElement<IAnonymousPollProps> = React.createElement(
      AnonymousPoll,
      {
        pollDetails: this.properties,
        currentUser: `abc.com`, //this.context.pageContext.user.email,
        isEditMode: this.displayMode === DisplayMode.Edit,
        logSource: LOG_SOURCE
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    let response: boolean;
    if (propertyPath === 'pollAction') {

      switch (newValue) {
        case 'PollStarted':
          response = confirm("Do you want to start the poll ?");
          set(this.properties, "pollStarted", response);
          set(this.properties, "pollAction", response ? newValue : oldValue);
          break;
        case 'PollStopped':
          response = confirm("Do you want to stop the poll? Users won't be able to vote after then, continue ?");
          set(this.properties, "pollStarted", !response);
          set(this.properties, "pollAction", response ? newValue : oldValue);
          break;
        case 'ClearResults':
          response = confirm("You will loose all the poll results and cannot be undone. Do you want to continue ?");
          if (response) {
            this.properties.color = undefined;
            this.properties.options = undefined;
            this.properties.pollAction = 'PollStopped';
            this.properties.pollData = [];
            this.properties.pollStarted = false;
            this.properties.question = undefined;
            this.properties.showResultToUser = true;
            this.properties.usersVoted = [];
          }
          break;
      }
      this.context.propertyPane.refresh();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: `Anonymous Poll`
          },
          groups: [
            {
              groupName: 'Poll Configuration',
              groupFields: [
                PropertyPaneTextField('question', {
                  underlined: true,
                  placeholder: `Enter the question`,
                  disabled: this.properties.pollStarted
                }),
                PropertyPaneTextField('options', {
                  multiline: true,
                  underlined: true,
                  placeholder: `Mention the options in new line (seperated by Enter)`,
                  disabled: this.properties.pollStarted
                }),
                PropertyPaneTextField('color', {
                  underlined: true,
                  placeholder: `color code in #0000 format`,
                  description: `default color will be theme color`,
                  disabled: this.properties.pollStarted
                }),
                PropertyPaneToggle('showResultToUser', {
                  checked: true,
                  onText: `Show result to users`,
                  offText: 'Hide result from users',
                  label: `Result display`,
                  disabled: this.properties.pollStarted
                }),
                PropertyPaneChoiceGroup('pollAction', {
                  label: 'Poll Action',
                  options: [
                    { checked: this.properties.pollStarted, key: 'PollStarted', text: 'Start Poll' },
                    { checked: !this.properties.pollStarted, key: 'PollStopped', text: 'Stop Poll' },
                    { checked: !this.properties.pollStarted, key: 'ClearResults', text: 'Clear Poll Results', disabled: this.properties.pollStarted }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
