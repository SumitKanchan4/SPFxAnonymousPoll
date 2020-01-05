import { IAnonymousPollWebPartProps } from "../AnonymousPollWebPart";
import { ServiceScope } from "@microsoft/sp-core-library";

export interface IAnonymousPollProps {
  pollDetails: IAnonymousPollWebPartProps;
  currentUser: string;
  isEditMode: boolean;
  pollStarted: boolean;
  serviceScope: ServiceScope;
}

export interface IPollData {
  option: string;
  votes: string;
}
