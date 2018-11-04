import { connect } from 'react-redux'
import ethUtil from 'ethereumjs-util'
import {
  addToAddressBook,
  clearSend,
  signTokenTx,
  signTx,
  updateTransaction,
} from '../../../actions'
import SendFooter from './send-footer.component'
import {
  getSelectedToken,
  getSendAmount,
  getSendEditingTransactionId,
  getSendFromObject,
  getSendTo,
  getSendToAccounts,
  getSendHexData,
  getTokenBalance,
  getUnapprovedTxs,
} from '../send.selectors'
import {
  isSendFormInError,
} from './send-footer.selectors'
import {
  addressIsNew,
  constructTxParams,
  constructUpdatedTx,
} from './send-footer.utils'

export default connect(mapStateToProps, mapDispatchToProps)(SendFooter)

function mapStateToProps (state) {
  return {
    amount: getSendAmount(state),
    data: getSendHexData(state),
    editingTransactionId: getSendEditingTransactionId(state),
    from: getSendFromObject(state),
    inError: isSendFormInError(state),
    selectedToken: getSelectedToken(state),
    to: getSendTo(state),
    toAccounts: getSendToAccounts(state),
    tokenBalance: getTokenBalance(state),
    unapprovedTxs: getUnapprovedTxs(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSend: () => dispatch(clearSend()),
    sign: ({ selectedToken, to, amount, from, data }) => {
      const txParams = constructTxParams({
        amount,
        data,
        from,
        selectedToken,
        to,
      })

      selectedToken
        ? dispatch(signTokenTx(selectedToken.address, to, amount, txParams, selectedToken.protocol, selectedToken.symbol))
        : dispatch(signTx(txParams))
    },
    update: ({
      amount,
      data,
      editingTransactionId,
      from,
      selectedToken,
      to,
      unapprovedTxs,
    }) => {
      const editingTx = constructUpdatedTx({
        amount,
        data,
        editingTransactionId,
        from,
        selectedToken,
        to,
        unapprovedTxs,
      })

      return dispatch(updateTransaction(editingTx))
    },
    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      if (addressIsNew(toAccounts)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(newAddress, nickname))
      }
    },
  }
}
