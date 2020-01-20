/**
 * Imports
 */
import React from 'react';
import PropTypes from 'prop-types';

// Flux
import ApplicationStore from '../../../stores/Application/ApplicationStore';

// Required components
import FormLabel from './FormLabel';
import Text from '../typography/Text';

// Instantiate logger
let debug = require('debug')('simple-store');

/**
 * Component
 */
class Textarea extends React.Component {

    static contextTypes = {
        getStore: PropTypes.func.isRequired
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Textarea.scss');
    }

    //*** View Controllers ***//

    handleChange = (evt) => {
        this.props.onChange(evt.target.value);
    };

    //*** Template ***//

    render() {

        let id = `textarea-${this.context.getStore(ApplicationStore).uniqueId()}`;

        let textareaClass = 'textarea__input';
        if (this.props.error) {
            textareaClass += ' textarea__input--error';
        }

        return (
            <div className="textarea">
                {this.props.label ?
                    <div className="textarea__label">
                        <FormLabel for={id} size={this.props.labelSize} weight={this.props.labelWeight}>
                            {this.props.label}
                        </FormLabel>
                    </div>
                    :
                    null
                }
                <div>
                    <textarea id={id} className={textareaClass} rows={this.props.rows}
                              onChange={this.handleChange} value={this.props.value}
                              disabled={this.props.disabled} />
                </div>
                {this.props.error ?
                    <div className="input-field__error">
                        <Text size="small">{this.props.error}</Text>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

/**
 * Default Props
 */
Textarea.defaultProps = {
    onChange: function (value) { debug(`onChange not defined. Value: ${value}`); }
};

/**
 * Exports
 */
export default Textarea;
