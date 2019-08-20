import {runSaga} from 'redux-saga';
import { accountService } from "../../services/account";
import {displayNameUpdateRequestHandler} from "./sagas";
import {DISPLAY_NAME_UPDATE_REQUEST,DISPLAY_NAME_UPDATE_SUCCESS,
  DISPLAY_NAME_EDIT_TOGGLE,DISPLAY_NAME_UPDATE_FAIL
} from "./actions";

import { notificationShow } from "../Root/actions";


describe("Account Sagas", () => {
    
    it('displayNameUpdateRequestHandler should handle DISPLAY_NAME_UPDATE_REQUEST',async ()=>{
      const dispatchedActions=[];
      const mockUid = "someUID001";
      const fakeStore={
        
        dispatch: action => dispatchedActions.push(action),
        getState: () => ({
          firebase: {
            auth: {
              uid: mockUid
            }
          }
        })

      };
      accountService.updateDisplayName = jest.fn(()=> Promise.resolve());
      
      await runSaga(fakeStore,displayNameUpdateRequestHandler,
       {
        type: DISPLAY_NAME_UPDATE_REQUEST,
        name: "TestName"
       }).done;
     
      expect(dispatchedActions).toEqual(
        [
          {
            type: DISPLAY_NAME_UPDATE_SUCCESS
          },
          {
            type: DISPLAY_NAME_EDIT_TOGGLE,
            status: false
          }
        ]
      );
    
    })

    it('should report an issue when updating display name',async ()=>{
      const dispatchedActions=[];
      const mockUid = "someUID001";
      const fakeStore={
        
        dispatch: action => dispatchedActions.push(action),
        getState: () => ({
          firebase: {
            auth: {
              uid: mockUid
            }
          }
        })

      };
      accountService.updateDisplayName = jest.fn(()=> Promise.reject({ message: "Error occured" }));
      
      await runSaga(fakeStore,displayNameUpdateRequestHandler,
       {
        type: DISPLAY_NAME_UPDATE_REQUEST,
        name: "TestName"
       }).done;      
      expect(dispatchedActions).toEqual(
        [
          {
            type: DISPLAY_NAME_UPDATE_FAIL,
            reason:"Error occured"
          },
          
            notificationShow("Error occured")
          
        ]
      );
    
    })
    
})
