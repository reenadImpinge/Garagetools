<?php

namespace common\models;

use yii\data\ActiveDataProvider;
use yii\db\ActiveRecord;
use Yii;

class Material extends ActiveRecord {

    const STATUS_DELETED   = -1;
    const STATUS_ACTIVE    = 1;
    const STATUS_INACTIVE  = 0;
    const QTY_DEFAULT      = 1;

    public $modelPageName = 'Material';
    public $modelPageUrl  = 'material';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'materials';
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id'           => Yii::t('app','ID'),
            'name'         => Yii::t('app','Name'),
            'status'       => Yii::t('app','Status'),
            'description'  => Yii::t('app', 'Description'),
            'price'        => Yii::t('app', 'Price'),
            'fixed_price'  => Yii::t('app', 'Fixed Price Cost'),
            'price_type'   => Yii::t('app', 'Price Type'),
            'roll_length' => Yii::t('app', 'Roll Length'),
            'roll_length_unit' => Yii::t('app', 'Length Unit'),
            'roll_width'  => Yii::t('app', 'Roll Width'),
            'roll_width_unit' => Yii::t('app', 'Width Unit')
            // 'roll_price'   => Yii::t('app', 'Cost per Roll Price'),
            // 'roll_price_unit' => Yii::t('app', 'Cost per Unit'),
            // 'dimensions' => Yii::t('app', 'Dimensions')
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['owner_id', 'name', ], 'required'],
            [['owner_id', 'status'], 'integer'],
            [['created', 'price', 'updated', 'description', 'status', 'owner_id', 'fixed_price', 'price_type','roll_price', 'roll_price_unit', 'dimensions'], 'safe'],
            [['name'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if ($this->isNewRecord) {
                $this->created = date('Y-m-d H:i:s');
            }

            $this->updated = date('Y-m-d H:i:s');
            return true;
        }

        return false;
    }

    /*
     * function search list location by owner_id
     * @param array, int
     * @return dataProvider
     */
    public function search($params = null, $owner_id = null,$delete = null)
    {
        $query = self::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => Yii::$app->params['page_size'],
             ],
        ]);

        if(!empty($delete)) {
            $query->andWhere(['=','status' , self::STATUS_DELETED]);
        } else {
            $query->andWhere(['<>','status' , self::STATUS_DELETED]);
        }

        $query->andWhere(['owner_id' => $owner_id]);
        $query->andFilterWhere(['like','name', $this->name]);
        $query->andFilterWhere(['=','status', $this->status]);
        $query->andFilterWhere(['>=','created', $this->created]);
        $query->andFilterWhere(['=','price', $this->price]);
        $query->andFilterWhere(['=','fixed_price', $this->price]);

        return $dataProvider;
    }

    /**
    * Get all status
    *
    * @param None
    * @return String
    */
    public function getStatusText()
    {
        $status = '';
        switch ($this->status) {
            case -1:
              $status ='Delete';
                break;
            case 0:
              $status ='Inactive';
                break;
            case 1:
              $status ='Active';
                break;
            default :
                break;
        }

        return $status;
    }

    /**
    * Get all Service of owner
    *
    * @param int owner_id
    * @param int $id
    * @return array 
    */
    public static function getFullData( $owner_id, $id = null)
    {
        $list = self::find()
            ->select(['id', 'name'])
            ->where(['owner_id' => $owner_id, 'status' => self::STATUS_ACTIVE ])
            ->orFilterWhere(['id'=>$id])
            ->asArray()
            ->orderBy('name ASC')
            ->all();

        return \yii\helpers\ArrayHelper::map($list, 'id', 'name');
    }

    /**
    * Get getWrapTypeName
    *
    * @param int $id
    * @return string
    */
    public static function getWrapTypeName($id)
    {
        $data = WrapType::find()
            ->select(['id', 'name'])
            ->where(['id' => $id ])
            ->one();

        return !empty($data->name)
            ? $data->name
            : '';
    }
}
