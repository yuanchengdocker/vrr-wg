/*
 * 会话列表
 */

import store from '../'

// // 如果会话对象不是好友，需要更新好友名片
// function updateSessionAccount (sessions) {
//   let accountsNeedSearch = []
//   sessions.forEach(item => {
//     if (item.scene === 'p2p') { //单点
//       // 如果不存在缓存资料
//       if (!store.state.userInfos[item.to]) {
//         accountsNeedSearch.push(item.to)
//       }
//     }
//   })
//   if (accountsNeedSearch.length > 0) {
//     store.dispatch('searchUsers', {
//       accounts: accountsNeedSearch
//     })
//   }
// }

export function setCurrSession ({state, commit, dispatch}, sessionId) {
    const nim = state.nim
    if (sessionId) {
      commit('updateCurrSessionId', {
        type: 'init',
        sessionId
      })
      if (nim) {
        // 如果在聊天页面刷新，此时还没有nim实例，需要在onSessions里同步
        nim.setCurrSession(sessionId)
        commit('resetNoMoreHistoryMsgs')
        commit('updateCurrSessionMsgs', {
          type: 'init',
          sessionId
        })
        // 发送已读回执
        dispatch('sendMsgReceipt')
      }
    }
  }
  
  export function resetCurrSession ({state, commit}) {
    const nim = state.nim
    nim.resetCurrSession()
    commit('updateCurrSessionMsgs', {
      type: 'destroy'
    })
  }

// onSessions只在初始化完成后回调
export function onSessions (sessions) {
  console.log('onSessions')
  // updateSessionAccount(sessions)
  store.commit('updateSessions', sessions)
  store.dispatch('saveData', {obj:sessions,table:'Sessions'})
}

export function onUpdateSession (session) {
  console.log('onUpdateSession',session)
  let sessions = [session]
  // updateSessionAccount(sessions)
  store.commit('updateSessions', sessions)
  store.dispatch('saveData', {obj:sessions,table:'Sessions'})
}


export function deleteSession ({state, commit}, sessionId) {
  const nim = state.nim
  sessionId = sessionId || ''
  let scene = null
  let account = null
  if (/^p2p-/.test(sessionId)) {
    scene = 'p2p'
    account = sessionId.replace(/^p2p-/, '')
  } else if (/^team-/.test(sessionId)) {
    scene = 'team'
    account = sessionId.replace(/^team-/, '')
  }
  if (account && scene) {
    nim.deleteSession({
      scene,
      to: account,
      done: function deleteServerSessionDone (error, obj) {
        if (error) {
          alert(error)
          return
        }
        nim.deleteLocalSession({
          id: sessionId,
          done: function deleteLocalSessionDone (error, obj) {
            if (error) {
              alert(error)
              return
            }
            commit('deleteSessions', [sessionId])
          }
        })
      }
    })
  }
}

