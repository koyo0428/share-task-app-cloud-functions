const functions = require('firebase-functions')
const admin = require('firebase-admin');
const { DataSnapshot } = require('firebase-functions/lib/providers/database');
admin.initializeApp()
const firestore = admin.firestore()


//push通知実行メソッド
const pushMessage = (fcmToken, taskGroupName, taskName) => ({
  notification: {
      title: `リマインダー: ${taskName}`,
      body:  `タスクグループ名: ${taskGroupName}`,
  },
  apns: {
      headers: {
          'apns-priority': '10'
      },
      payload: {
          aps: {
              badge: 9999,
              sound: 'default'
          }
      }
  },
  data: {
      data: 'test',
  },
  token: fcmToken
});

// ///関数
// exports.mySendMessages = functions.region('asia-northeast1')
//   .runWith({ memory: '512MB' })
//   .pubsub.schedule('every 1 minutes')//関数を実行する時間間隔が設定できる
//   .timeZone('Asia/Tokyo')
//   .onRun(async (context) => {

//     // 秒を切り捨てた現在時刻
//     const now = (() => {
//       let s = admin.firestore.Timestamp.now().seconds
//       s = s - s % 60
//       return new admin.firestore.Timestamp(s, 0)
//     })()

//     //秒を切り捨てた昨日の時刻（動作確認のため広めに設定）
//     const yesterday = (() => {
//       let s = admin.firestore.Timestamp.now().seconds
//       s = s - 86400
//       return new admin.firestore.Timestamp(s, 0)
//     })()

//     //秒を切り捨てた明日の時刻
//     const tomorrow = (() => {
//       let s = admin.firestore.Timestamp.now().seconds
//       s = s + 43200
//       return new admin.firestore.Timestamp(s, 0)
//     })()


//     ///時刻の確認
//     console.log('now', now.toDate())
//     console.log('yesterday', yesterday.toDate())
//     console.log('tomorrow', tomorrow.toDate())
    
    
//     //try（うまくデータが取れた！）
//     const pushDataRef = firestore.collection('pushData');
//     // const snapshot = firestore.collection('pushData');
//     // const snapshot = await pushDataRef.where('postAt', '>=', yesterday).where('postAt', '<=', tomorrow).get();
//     const snapshot = await pushDataRef.where('postAt', '>=', 1).get();
//     if (snapshot.empty) {
//       console.log('No matching documents.');
//       return;
//     }
//     snapshot.forEach(doc => {
//       console.log(doc.id, '=>', doc.data());
//       console.log(doc.data()['postAt']);
//       //通知送信
//       const token = doc.data()['fcmToken']
//       const title = doc.data()['title']
//       admin.messaging().send(pushMessage(token, title))
//     });     
//   })

  exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.

    const nowDate = new Date();
    // 現在日時(時間切り捨て)
    const nowDateTrunc = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())
    const tomorrowDateTrunc = new Date(nowDate.getFullYear(), nowDate.getMonth(), (nowDateTrunc.getDate() + 1));
    // tomorrowDate.setDate(nowDateTrunc.getDate() + 1);

    // // テストデータ挿入
    // const otherDateTrunc = new Date(nowDate.getFullYear(), nowDate.getMonth(), (nowDateTrunc.getDate() + 10));
    // const minusDateTrunc = new Date(nowDate.getFullYear(), nowDate.getMonth(), (nowDateTrunc.getDate() - 1));

    // await admin.firestore().collection('users').doc('user1').collection('taskGroupIds').doc('taskGroup1').set({
    //     taskGroupId: 'taskGroup1', notificationFlag: true
    //   });
    // await admin.firestore().collection('users').doc('user1').collection('taskGroupIds').doc('taskGroup2').set({
    //     taskGroupId: 'taskGroup2', notificationFlag: false
    //   });
    // await admin.firestore().collection('users').doc('user1').set({fcmToken: 'c5C5t4_pSqG10bHTHSSTeI:APA91bECazAjgeDVtoUtN6InDQwSULUd0hGQioCzwJnq08LXU2ktxfmL9hpiTTS_-WFeHxleaQKo5bREX8FG0bz0XFJvgkxBrUK1MPPgfxZn4Bw_Lra2JEwSKfe_wtQE_O0gql0FCFx6'});
    // await admin.firestore().collection('users').doc('user2').collection('taskGroupIds').doc('taskGroup3').set({
    //     taskGroupId: 'taskGroup3',  notificationFlag: true
    //   });
    // await admin.firestore().collection('users').doc('user2').set({fcmToken: 'c5C5t4_pSqG10bHTHSSTeI:APA91bECazAjgeDVtoUtN6InDQwSULUd0hGQioCzwJnq08LXU2ktxfmL9hpiTTS_-WFeHxleaQKo5bREX8FG0bz0XFJvgkxBrUK1MPPgfxZn4Bw_Lra2JEwSKfe_wtQE_O0gql0FCFx6'});
    // // テストデータ挿入
    // await admin.firestore().collection('taskGroups').doc('taskGroup1').set({
    //     taskGroupName: 'taskGroupName1'
    // })
    // await admin.firestore().collection('taskGroups').doc('taskGroup2').set({
    //     taskGroupName: 'taskGroupName2'
    // })
    // await admin.firestore().collection('taskGroups').doc('taskGroup3').set({
    //     taskGroupName: 'taskGroupName3'
    // })
    // await admin.firestore().collection('taskGroups').doc('taskGroup1').collection('tasks').doc('task1').set({
    //     taskName: 'taskName1', date: nowDateTrunc
    //   });
    // await admin.firestore().collection('taskGroups').doc('taskGroup1').collection('tasks').doc('task2').set({
    //     taskName: 'taskName2', date: otherDateTrunc
    // });
    // await admin.firestore().collection('taskGroups').doc('taskGroup2').collection('tasks').doc('task3').set({
    //     taskName: 'taskName3', date: minusDateTrunc
    // });
    // await admin.firestore().collection('taskGroups').doc('taskGroup3').collection('tasks').doc('task4').set({
    //     taskName: 'taskName4', date: otherDateTrunc
    // });

    var notificationUsers = [];
    var notifications = [];
    var tempIdList = [];
    var tempTaskList = [];
    var tempTaskGroupList = [];

    // ユーザー一覧スナップショット取得
    const users = await admin.firestore().collection('users').get();
    console.log('********');
    for (const doc of users.docs) {
        console.log(doc.id, '=>', doc.data());
        // タスクグループID一覧(サブコレクション)スナップショット取得
        var taskGroupIds = await doc.ref.collection('taskGroupIds').get();
        tempIdList = [];
        for (const e of taskGroupIds.docs) {
            console.log(e.id, '=>', e.data());
            tempIdList.push(e.data().taskGroupId);
        }
        if(tempIdList.length > 0) {
            notificationUsers.push({token: doc.data().fcmToken, taskGroupIdList: tempIdList});
        } else {
            // do nothing
        }
        console.log('notificationUsers=======')
        console.log(notificationUsers);
    };
    console.log('--------------');
  
    console.log('********');
    // タスクグループ一覧スナップショット取得
    const taskGroups = admin.firestore().collection('taskGroups')
    for (const userInfo of notificationUsers) {
        tempTaskGroupList = []
        for(const taskGroupId of userInfo.taskGroupIdList) {
            console.log('[[[[[[[[[[[[[[[[');
            // 該当するタスクグループ(サブコレクション)のスナップショット取得
            var taskGroup = await taskGroups.doc(taskGroupId).get();
            // 完了予定日付が今日以前のタスクを取得
            var tasks = await taskGroup.ref.collection('tasks').where('date', '<', tomorrowDateTrunc).get();
            tempTaskList = []
            for (const task of tasks.docs) {
                tempTaskList.push(task.data().taskName);
            }
            if(tempTaskList.length > 0) {
                tempTaskGroupList.push({taskGroupName: taskGroup.data().taskGroupName, taskList: tempTaskList});
            } else {
                // do nothing
            }
        }
        if(tempTaskGroupList.length > 0) {
            // 通知対象リストに追加
            notifications.push({token: userInfo.token, taskGroupList: tempTaskGroupList});
        } else {
            // do nothing
        }
        console.log('notifications=======')
        for(const e of notifications) {
            console.log(e.taskGroupList);
        };
    };
    console.log('--------------');

    // 通知送信
    for(const target of notifications) {
        for(const targetTaskGroup of target.taskGroupList) {
            for(const targetTask of targetTaskGroup.taskList) {
                admin.messaging().send(pushMessage(target.token, targetTaskGroup.taskGroupName, targetTask));
                console.log('~~~~~send message~~~~~')
                console.log(`group: ${targetTaskGroup.taskGroupName}, task: ${targetTask}`)
            }
        }
    }

  });