import React, { useRef, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar'
import { connect } from 'react-redux';

const LoadingBarr = props => {
    const ref = useRef(null);

    useEffect(()=>{
        if(props.loading === true){
            ref.current.continuousStart()
        }else if(props.loading === false){
            ref.current.complete()
        }
    },[props.loading]);

    return <LoadingBar color='#321fdb' ref={ref} />
}

const mapStateToProps = state => ({
    loading : state.api.isLoadingData
});

export default connect(mapStateToProps, null)(LoadingBarr);
  
