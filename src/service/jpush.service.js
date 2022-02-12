import axios from "axios";

const jpush_server = "http://127.0.0.1:8080/msg";


function ThrowError(){
  return {
    responseCode: "RESPONSE_ERROR",
    description: "Fail to process the request",
  };
}
function getAllUserInfo() {
  let obtain_url = jpush_server + "/getAllUserInfo";
  return axios
    .get(obtain_url)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      ThrowError();
    });
}

function getSendRecords() {
  let obtain_url = jpush_server + "/getSendRecords";
  return axios
    .get(obtain_url)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      ThrowError();
    });
}

function getAllTags(){
  let obtain_url = jpush_server + "/ getAllTags";
  return axios
    .get(obtain_url)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      ThrowError();
    });
}

function getReceivedInfo(msg_id) {
    let obtain_url = jpush_server + "/getReceivedInfo?msg_id=" + msg_id;
    return axios
      .get(obtain_url)
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        ThrowError();
      });
  }

function sendToAll(
  notificationTitle,
  notificationContent,
  pic_url,
  content,
  timeToLive
) {
  let params = new URLSearchParams();
  params.append("notificationTitle", notificationTitle);
  params.append("notificationContent", notificationContent);
  if (pic_url !== "") params.append("pic_url", pic_url);
  if (content !== "") params.append("content", content);
  params.append("timeToLive", timeToLive);
  let obtain_url = jpush_server + "/sendToAll";
  return axios
    .post(obtain_url, params)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      ThrowError();
    });
}

function sendByRid(
  notificationTitle,
  notificationContent,
  pic_url,
  content,
  timeToLive,
  ridsList
) {
  let params = new URLSearchParams();
  params.append("notificationTitle", notificationTitle);
  params.append("notificationContent", notificationContent);
  if (pic_url !== "") params.append("pic_url", pic_url);
  if (content !== "") params.append("content", content);
  params.append("timeToLive", timeToLive);
  params.append("ridsList", ridsList);
  let obtain_url = jpush_server + "/sendByRid";
  return axios
    .post(obtain_url, params)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      ThrowError();
    });
}

function sendToTagsList(
  notificationTitle,
  notificationContent,
  pic_url,
  content,
  timeToLive,
  tagsList
) {
  let params = new URLSearchParams();
  params.append("notificationTitle", notificationTitle);
  params.append("notificationContent", notificationContent);
  if (pic_url !== "") params.append("pic_url", pic_url);
  if (content !== "") params.append("content", content);
  params.append("timeToLive", timeToLive);
  params.append("tagsList", tagsList);
  let obtain_url = jpush_server + "/sendToTagsList";
  return axios
    .post(obtain_url, params)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      ThrowError();
    });
}

export const jpushService = {
  getAllUserInfo,
  getSendRecords,
  sendToAll,
  sendByRid,
  sendToTagsList,
  getReceivedInfo,
  getAllTags
};
