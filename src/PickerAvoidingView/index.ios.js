import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { PickerStateContext } from '../PickerStateProvider';
import { IOS_MODAL_HEIGHT } from '../constants';

/**
 * PickerAvoidingView is a React component that adjusts the view layout to avoid
 * being covered by an open iOS picker modal. It's meant to be similar to
 * the built-in KeyboardAvoidingView component, but specifically tailored for
 * iOS picker modals.
 *
 * In order for this component to work correctly, all the pickers and the
 * PickerAvoidingView should have a PickerStateProvider ancestor.
 *
 * @param {React.ReactNode} props.children - The child components that should be
 * protected from obstruction by the picker modal
 */
// eslint-disable-next-line react/prefer-stateless-function
export class PickerAvoidingView extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
    };

    static defaultProps = {
        enabled: true,
    };

    render() {
        const { enabled, style, ...viewProps } = this.props;

        return (
            <PickerStateContext.Consumer>
                {(context) => {
                    const isModalShown = context && context.isModalShown;
                    const effectiveStyle = enabled
                        ? StyleSheet.compose(style, {
                              paddingBottom: isModalShown ? IOS_MODAL_HEIGHT : 0,
                          })
                        : style;

                    return <View style={effectiveStyle} {...viewProps} />;
                }}
            </PickerStateContext.Consumer>
        );
    }
}
