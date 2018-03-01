import firebase from "firebase";

export class PathsService {
  auth(token) {
    window.gapi.auth.setToken({ access_token: token });
    return new Promise(resolve =>
      window.gapi.client.load("drive", "v3", resolve)
    );
  }
  fetchFile(fileId) {
    window.gapi.client.drive.files
      .get({
        fileId
      })
      .execute();
  }
  pathChange(uid, pathInfo) {
    const key = firebase
      .database()
      .ref("/paths")
      .push().key;

    return firebase
      .database()
      .ref(`/paths/${key}`)
      .set({ ...pathInfo, owner: uid })
      .then(() => key);
  }
}

/** @type PathsService */
export const pathsService = new PathsService();
