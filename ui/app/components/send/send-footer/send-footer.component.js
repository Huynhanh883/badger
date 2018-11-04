import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../page-container/page-container-footer'
import { CONFIRM_TRANSACTION_ROUTE, DEFAULT_ROUTE } from '../../../routes'

export default class SendFooter extends Component {

  static propTypes = {
    addToAddressBookIfNew: PropTypes.func,
    amount: PropTypes.string,
    data: PropTypes.string,
    clearSend: PropTypes.func,
    disabled: PropTypes.bool,
    editingTransactionId: PropTypes.string,
    errors: PropTypes.object,
    from: PropTypes.object,
    history: PropTypes.object,
    inError: PropTypes.bool,
    selectedToken: PropTypes.object,
    sign: PropTypes.func,
    to: PropTypes.string,
    toAccounts: PropTypes.array,
    tokenBalance: PropTypes.string,
    unapprovedTxs: PropTypes.object,
    update: PropTypes.func,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  onCancel () {
    this.props.clearSend()
    this.props.history.push(DEFAULT_ROUTE)
  }

  onSubmit (event) {
    event.preventDefault()
    const {
      addToAddressBookIfNew,
      amount,
      data,
      editingTransactionId,
      from: {address: from},
      selectedToken,
      sign,
      to,
      unapprovedTxs,
      // updateTx,
      update,
      toAccounts,
      history,
    } = this.props

    // Should not be needed because submit should be disabled if there are errors.
    // const noErrors = !amountError && toError === null

    // if (!noErrors) {
    //   return
    // }

    // TODO: add nickname functionality
    addToAddressBookIfNew(to, toAccounts)

    const promise = editingTransactionId
      ? update({
        amount,
        data,
        editingTransactionId,
        from,
        selectedToken,
        to,
        unapprovedTxs,
      })
      : sign({ data, selectedToken, to, amount, from })

    Promise.resolve(promise)
      .then(() => history.push(CONFIRM_TRANSACTION_ROUTE))
  }

  formShouldBeDisabled () {
    const { inError, selectedToken, tokenBalance, to } = this.props
    const missingTokenBalance = selectedToken && !selectedToken.string
    return inError || missingTokenBalance || !to
  }

  render () {
    return (
      <PageContainerFooter
        onCancel={() => this.onCancel()}
        onSubmit={e => this.onSubmit(e)}
        disabled={this.formShouldBeDisabled()}
      />
    )
  }

}
