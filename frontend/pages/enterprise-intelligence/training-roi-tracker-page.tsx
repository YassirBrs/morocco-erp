import { EnterpriseIntelligenceFeaturePage, makeEnterpriseIntelligenceServerSideProps } from '../../features/enterprise-intelligence/enterprise-intelligence-feature-page';
export const getServerSideProps = makeEnterpriseIntelligenceServerSideProps('trainingRoi');
export default EnterpriseIntelligenceFeaturePage;
