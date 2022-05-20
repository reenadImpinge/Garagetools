<?php

use yii\db\Migration;

/**
 * Handles dropping roll_price from table `materials`.
 */
class m220513_114602_drop_roll_price_column_from_materials_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropColumn('materials', 'roll_price');
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->addColumn('materials', 'roll_price', $this->decimal());
    }
}
