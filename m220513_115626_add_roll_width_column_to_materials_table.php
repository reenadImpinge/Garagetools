<?php

use yii\db\Migration;

/**
 * Handles adding roll_width to table `materials`.
 */
class m220513_115626_add_roll_width_column_to_materials_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->addColumn('materials', 'roll_width', $this->decimal());
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropColumn('materials', 'roll_width');
    }
}
