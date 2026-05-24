import { EnterpriseIntelligenceFeaturePage, makeEnterpriseIntelligenceServerSideProps } from '../../features/enterprise-intelligence/enterprise-intelligence-feature-page';
export const getServerSideProps = makeEnterpriseIntelligenceServerSideProps('iceIfDataQuality');
export default EnterpriseIntelligenceFeaturePage;
