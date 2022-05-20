<?php

use yii\db\Migration;

/**
 * Handles dropping roll_price_unit from table `materials`.
 */
class m220513_114731_drop_roll_price_unit_column_from_materials_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropColumn('materials', 'roll_price_unit');
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->addColumn('materials', 'roll_price_unit', $this->text());
    }
}
