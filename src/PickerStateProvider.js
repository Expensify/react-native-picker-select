import React from 'react';

/**
 * @typedef {Object} PickerStateData
 * @property {boolean} isModalOpen - Indicates whether a picker-related modal is
 * currently being shown. Note that currently modal is opened for pickers only
 * on iOS.
 *
 * PickerStateContext is a context that gives access to PickerStateData.
 */
export const PickerStateContext = React.createContext();

/**
 * PickerStateProvider provides PickerStateContext and manages the necessary
 * state.
 *
 * This component should be used as a single top-level provider for all picker
 * instances in your application.
 */
export class PickerStateProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalShown: false,
        };
    }

    render() {
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        const context = {
            isModalShown: this.state.isModalShown,
            setIsModalShown: (isModalShown) => {
                this.setState({ isModalShown });
            },
        };

        return (
            <PickerStateContext.Provider value={context}>
                {this.props.children}
            </PickerStateContext.Provider>
        );
    }
}
