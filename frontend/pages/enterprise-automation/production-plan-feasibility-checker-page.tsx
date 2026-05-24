import { EnterpriseAutomationFeaturePage, makeEnterpriseAutomationServerSideProps } from '../../features/enterprise-automation/enterprise-automation-feature-page';
export const getServerSideProps = makeEnterpriseAutomationServerSideProps('productionFeasibility');
export default EnterpriseAutomationFeaturePage;
