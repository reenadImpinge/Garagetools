<?php

use yii\db\Migration;

/**
 * Handles adding roll_length to table `materials`.
 */
class m220513_115037_add_roll_length_column_to_materials_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->addColumn('materials', 'roll_length', $this->decimal());
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropColumn('materials', 'roll_length');
    }
}
