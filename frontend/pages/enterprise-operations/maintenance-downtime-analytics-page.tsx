import { EnterpriseOperationsFeaturePage, makeEnterpriseOperationsServerSideProps } from '../../features/enterprise-operations/enterprise-operations-feature-page';

export const getServerSideProps = makeEnterpriseOperationsServerSideProps('downtimeAnalytics');

export default EnterpriseOperationsFeaturePage;
