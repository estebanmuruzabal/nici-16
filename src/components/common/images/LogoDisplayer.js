/**
 * Imports
 */
import React from 'react';
import {Link} from 'react-router-dom';
/**
 * Component
 */
class LogoDisplayer extends React.Component {

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./LogoDisplayer.scss');
    }

    //*** View Controllers ***//


    //*** Template ***//

    render() {

        return (
            <Link className="desktop-header__logo-link" to={`/${this.props.locale}`}>
                    {this.props.logo.length > 0
                        && this.props.logo[0].body 
                            && this.props.logo[0].body.image 
                                && (this.props.logo[0].body.image.url || this.props.logo[0].body.link) ?
                                <div className="desktop-header__logo">
                                    <img src={`//${this.props.logo[0].body.image.url || this.props.logo[0].body.link}`}
                                        alt={this.props.logo[0].alt} />
                                </div>
                        :
                        <div>No Logo Found</div>
                    }
            </Link>
        );
    }
}

/**
 * Exports
 */
export default LogoDisplayer;
