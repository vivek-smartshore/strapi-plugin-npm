import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AnErrorOccurred } from '@strapi/helper-plugin'
import { Layout } from '@strapi/design-system'
import FormsPage from '../FormsPage'
import FormsEditPage from '../FormsPage/FormsEditPage'
import SubmissionsPage from '../SubmissionsPage'
import SubmissionsViewPage from '../SubmissionsPage/SubmissionViewPage'
import SubMenu from '../../components/Menus/SubMenu'
import FormCreate from '../../components/Forms/FormCreate'
import FormURLs from '../../utils/urls'

const App: React.FC = () => {
  return (
    <Layout sideNav={<SubMenu />}>
      <Switch>
        <Route path={FormURLs.FRONT_END_BASE_URL} component={FormsPage} exact>
          <Redirect to={FormURLs.LISTING_WITH_QUERY()} />
        </Route>
        <Route path={FormURLs.LISTING} component={FormsPage} exact />
        <Route path={FormURLs.EDIT(':formId')} component={FormsEditPage} exact />
        <Route path={FormURLs.SUBMISSIONS} component={SubmissionsPage} exact />
        <Route path={`${FormURLs.SUBMISSIONS}/:id`} component={SubmissionsViewPage} exact />
        <Route component={AnErrorOccurred} />
      </Switch>
      <FormCreate />
    </Layout>
  )
}

export default App
