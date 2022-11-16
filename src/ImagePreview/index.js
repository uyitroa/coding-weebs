import React from 'react';
import PropTypes from 'prop-types';

import './styles/imagePreview.css';

export const ImagePreview = ({ dataUri, isFullscreen }) => {
    let classNameFullscreen = isFullscreen ? 'ImagePreview-image-preview-fullscreen' : '';

    return (
        <div className={'ImagePreview-image-preview ' + classNameFullscreen}>
            <img src={dataUri} />
        </div>
    );
};

ImagePreview.propTypes = {
    dataUri: PropTypes.string,
    isFullscreen: PropTypes.bool
};

export default ImagePreview;