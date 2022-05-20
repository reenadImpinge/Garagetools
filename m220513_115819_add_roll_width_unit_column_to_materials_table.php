<?php

use yii\db\Migration;

/**
 * Handles adding roll_width_unit to table `materials`.
 */
class m220513_115819_add_roll_width_unit_column_to_materials_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->addColumn('materials', 'roll_width_unit', $this->text());
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropColumn('materials', 'roll_width_unit');
    }
}
