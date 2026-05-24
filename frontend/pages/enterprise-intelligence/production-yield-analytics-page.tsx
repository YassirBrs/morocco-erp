import { EnterpriseIntelligenceFeaturePage, makeEnterpriseIntelligenceServerSideProps } from '../../features/enterprise-intelligence/enterprise-intelligence-feature-page';
export const getServerSideProps = makeEnterpriseIntelligenceServerSideProps('productionYield');
export default EnterpriseIntelligenceFeaturePage;
