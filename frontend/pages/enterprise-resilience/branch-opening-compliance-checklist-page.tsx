import { EnterpriseResilienceFeaturePage, makeEnterpriseResilienceServerSideProps } from '../../features/enterprise-resilience/enterprise-resilience-feature-page';
export const getServerSideProps = makeEnterpriseResilienceServerSideProps('branchOpeningCompliance');
export default EnterpriseResilienceFeaturePage;
