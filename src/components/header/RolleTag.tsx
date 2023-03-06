import { Tag } from "@navikt/ds-react";
import React from "react";

import { ROLE_TAGS } from "../../constants/roleTags";
import { RolleType } from "../../constants/RolleType";

export const RolleTag = ({ rolleType }: { rolleType: RolleType }) => {
    return (
        <Tag variant={ROLE_TAGS[rolleType]} size="small" className="w-8 mr-2 rounded">
            {rolleType}
        </Tag>
    );
};
