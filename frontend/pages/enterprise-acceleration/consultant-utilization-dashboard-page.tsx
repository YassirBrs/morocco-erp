import { EnterpriseAccelerationFeaturePage, makeEnterpriseAccelerationServerSideProps } from '../../features/enterprise-acceleration/enterprise-acceleration-feature-page';

export const getServerSideProps = makeEnterpriseAccelerationServerSideProps('consultantUtilization');

export default EnterpriseAccelerationFeaturePage;
