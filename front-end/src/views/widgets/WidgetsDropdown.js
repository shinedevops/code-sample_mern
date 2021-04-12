import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import ChartLineSimple from '../charts/ChartLineSimple';
import { fetchUsersCount } from '../../actions/userActions';

const WidgetsDropdown = props => {
  
  useEffect(()=>{
    props.fetchUsersCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-primary"
          header={`${props.usersCount.count ? props.usersCount.count : 0}`}
          text="Total Users"
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{height: '70px'}}
              pointHoverBackgroundColor="primary"
              label="Members"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CDropdownToggle color="transparent">
              <CIcon name="cil-settings"/>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Action</CDropdownItem>
              <CDropdownItem>Another action</CDropdownItem>
              <CDropdownItem>Something else here...</CDropdownItem>
              <CDropdownItem disabled>Disabled action</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
    </CRow>
  )
}

const mapStateToProps = state => ({
  usersCount: state.user.usersCount,
})

export default connect(mapStateToProps, { fetchUsersCount })(WidgetsDropdown);
