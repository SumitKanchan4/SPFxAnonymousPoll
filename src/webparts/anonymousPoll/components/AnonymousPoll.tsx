import * as React from 'react';
import styles from './AnonymousPoll.module.scss';
import { IAnonymousPollProps, IPollData } from './IAnonymousPollProps';
import { SizeMe } from 'react-sizeme';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { set } from '@microsoft/sp-lodash-subset';
const voted: any = require('../assets/voted1.jpg');
import { SPLogger } from 'spfxhelper';
import { Log } from '@microsoft/sp-core-library';

export default class AnonymousPoll extends React.Component<IAnonymousPollProps, { selectedOption: string }> {

  constructor(props: IAnonymousPollProps, state: any) {
    super(props);
    this.state = {
      selectedOption: undefined
    };
  }

  public render(): React.ReactElement<IAnonymousPollProps> {
    let totalVotes: number = 0;
    this.props.pollDetails.pollData.map(item => totalVotes = totalVotes + item.votes);

    return (
      <div className={styles.anonymousPoll}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.row}>
              <div className={styles.col}> {JSON.stringify(this.props.pollDetails.usersVoted)}
                {
                  // If question exists
                  this.props.pollDetails.question ?
                    // check if the current user has voted                    
                    this.props.pollDetails.usersVoted && this.props.pollDetails.usersVoted.indexOf(this.props.currentUser) > -1 ?
                      // Check if user can see the poll result
                      this.props.pollDetails.showResultToUser || this.props.isEditMode ?
                        // Show result
                        <div className={styles.grid}>
                          <div className={styles.row}>
                            <div className={styles.col}>
                              <Label className={styles.lblQuestion}>{this.props.pollDetails.question}</Label>
                            </div>
                          </div>
                          {
                            this.props.pollDetails.options.split("\n").map(option => {
                              return (
                                <div className={styles.row}>
                                  <div className={styles.col}>
                                    {this.generatePollResult(option, totalVotes)}
                                  </div>
                                </div>
                              );
                            })
                          }
                          <hr />
                          <div className={styles.row}>
                            <div className={styles.col}>
                              <Label>Total Votes: {totalVotes}</Label>
                            </div>
                          </div>
                        </div>


                        :
                        //show already voted message
                        this.showVotedMessage()
                      :
                      // If user has not voted yet, show poll options
                      this.showPollOptions()
                    :
                    // if the question is not entered
                    <div>This webpart is not configured</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private generatePollResult(option: string, totalVotes: number): JSX.Element {

    let currentVotes: number = 0;
    this.props.pollDetails.pollData && this.props.pollDetails.pollData.some(item => item.option === option) ?
      currentVotes = currentVotes + this.props.pollDetails.pollData.filter(item => item.option === option)[0].votes : 0;

    let perc: number = Math.round((currentVotes / totalVotes) * 100);

    return (
      <div className={styles.grid} title={`Poll votes: ${currentVotes}`}>
        <div className={styles.row} style={{ padding: '0px' }}>
          <div className={`${styles.col} ${styles.pollOption}`}>{option}</div>
        </div>
        <div className={styles.row} style={{ padding: '0px' }}>
          <SizeMe>
            {
              ({ size }) =>
                <div className={styles.colPoll}>
                  <div className={styles.colPollColor} style={{ width: `${size.width * (perc / 100)}px`, backgroundColor: `${this.generateRandomColor()}` }} ></div>
                </div>
            }
          </SizeMe>
          <div className={styles.colPollPercent}>{perc}%</div>
        </div>
      </div>
    );
  }

  private showVotedMessage(): JSX.Element {
    return (
      <div className={styles.grid}>
        <div className={styles.row}>
          <div className={styles.col}>
            <Label className={styles.lblQuestion}>{this.props.pollDetails.question}</Label>
          </div>
        </div>
        <SizeMe>
          {({ size }) =>
            <div className={styles.row}>
              <div className={styles.col}>
                <img className={styles.imgVoted} src={voted} width={`${size.width}px`} alt={`You have voted`} style={{ margin: '10px' }}></img>
              </div>
            </div>
          }
        </SizeMe>
      </div>
    );
  }

  private showPollOptions(): JSX.Element {

    let options: IChoiceGroupOption[] = [];
    if (this.props.pollDetails.options) {
      this.props.pollDetails.options.split('\n').map(item => {
        options.push({ key: item.split(' ').join(''), text: item });
      });
    }
    return (
      <div className={styles.grid}>
        <div className={styles.row}>
          <div className={styles.col}>
            <ChoiceGroup
              options={options}
              disabled={!this.props.pollDetails.pollStarted}
              label={this.props.pollDetails.question} className={styles.lblQuestion}
              required={true}
              onChange={(ev, option) => this.optionOnChange(undefined, option)}
            ></ChoiceGroup>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <PrimaryButton text={`vote`} onClick={() => this.voteClicked(this.props)} disabled={!this.props.pollDetails.pollStarted}></PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  private voteClicked(props: IAnonymousPollProps): void {
    try {

      let pollInfo: IPollData[] = this.props.pollDetails.pollData;

      // if option is available in poll data
      if (pollInfo.some(item => item.option === this.state.selectedOption)) {
        pollInfo.filter(item => item.option === this.state.selectedOption)[0].votes += 1;
      }
      else {
        pollInfo.push({ option: this.state.selectedOption, votes: 1 });
      }

      let users: string[] = this.props.pollDetails.usersVoted;
      users.push(this.props.currentUser);
      set(this.props.pollDetails, "pollData", pollInfo);
      set(this.props.pollDetails, "usersVoted", users);
    }
    catch (error) {
      Log.error(this.props.logSource, new Error(`Error occured in AnonymousPoll.voteClicked()`));
      Log.error(this.props.logSource, error);
    }
  }

  private optionOnChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
    this.setState({ selectedOption: option.text });
  }

  private generateRandomColor(): string {

    let pollColor: string = undefined; // default value will be theme from scss file

    if (this.props.pollDetails.color) {
      pollColor = this.props.pollDetails.color;
    }
    return pollColor;
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Log.error(this.props.logSource, error);
    Log.error(this.props.logSource, new Error(errorInfo.componentStack));
  }
}
