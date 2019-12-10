import React, { createContext, Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Snackbar } from '@material-ui/core'

const context = createContext()

class SnackbarProvider extends Component {
    static propTypes = {
        SnackbarProps: PropTypes.object
    }

    state = {
        isOpen: false,
        isError: false,
        message: null
    }

    showMessage = (message, isError = false) =>
        this.setState({ isOpen: true, message, isError })

    close = () => this.setState({ isOpen: false })

    render () {
        const { message, isOpen, isError } = this.state
        const { children, snackbarProps = {} } = this.props

        const Action = () => (
            <Button
                color='primary'
                onClick={this.close}
                variant='contained'
            >
                Fermer
            </Button>
        )

        return (
            <context.Provider
                value={{
                    showMessage: this.showMessage
                }}
            >
                {children}
                <Snackbar
                    action={<Action />}
                    message={message}
                    onClose={this.close}
                    open={isOpen}
                    autoHideDuration={isError ? null : 3000}
                    {...snackbarProps}
                />
            </context.Provider>
        )
    }
}

export default SnackbarProvider

export const withSnackbar = WrappedComponent => props => (
    <context.Consumer>
        {snackbar => <WrappedComponent {...props} snackbar={snackbar} />}
    </context.Consumer>
)
